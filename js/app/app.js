var app = angular.module('tiendaApp', [
	"ui.router",
	"ui.bootstrap",
	"auth0.lock",
	"ngStorage",

	'tiendaApp.mainCtrl',
	'tiendaApp.singleProductCtrl',

	"tiendaApp.registroCtrl",
	"tiendaApp.loginCtrl",
	"tiendaApp.recuperacionPasswordCtrl",
	"tiendaApp.cajaCtrl",

	'tiendaApp.productsService',
	'tiendaApp.userService',
	'tiendaApp.catalogoMetodosPagosService',
	'tiendaApp.catalogoEstadoService',
	'tiendaApp.pedidoService',
	'tiendaApp.conektaService'

])
.config(['$urlRouterProvider', 'lockProvider', function ($urlRouterProvider, lockProvider) {
	$urlRouterProvider.otherwise('/')

	var options = {
		theme: {
		    labeledSubmitButton: false,
		    logo: "https://digdeep.mx/img/logoDD.png",
		    primaryColor: "#26a5dc",
		    authButtons: {
		      connectionName: {
		        displayName: "...", 
		        primaryColor: "...", 
		        foregroundColor: "...", 
		        icon: "https://.../logo.png"
		      }
		    },
		    redirectUrl: ""
		},
		language: "es",
		loginAfterSignUp: true,
		responseType: 'token',
		auth:{
			redirect: false,
	        responseType: 'token',
	        params:{
	          state:"some thing I need to preserve"
	        }
	    },
	    allowSignUp: true
	    //autoclose: true 
	}
	lockProvider.init({
	    clientID: 'cClzTGh4UG8urrvPOJzVqvaPMxnk3Ntl',
	    domain: 'digdeepproyecto.auth0.com',
	    options: options
  	});
}])
app.run(function(lock, $rootScope, $localStorage, $state) {
	// OPCIONES PARA LOK LOGIN
	var options = {
		theme: {
		    labeledSubmitButton: false,
		    logo: "https://digdeep.mx/img/logoDD.png",
		    primaryColor: "#26a5dc",
		    authButtons: {
		      connectionName: {
		        displayName: "...", 
		        primaryColor: "...", 
		        foregroundColor: "...", 
		        icon: "https://.../logo.png"
		      }
		    },
		    redirectUrl: ""
		},
		language: "es",
		loginAfterSignUp: true,
		responseType: 'token',
		auth:{
			redirect: false,
	        responseType: 'token',
	        params:{
	          state:"some thing I need to preserve"
	        }
	    },
	    allowSignUp: false
	    //autoclose: true 
	}
	var id_auth0 = ""
	var profile = {}

	$rootScope.lockLogin = new Auth0Lock('cClzTGh4UG8urrvPOJzVqvaPMxnk3Ntl', 'digdeepproyecto.auth0.com', options);
 	$rootScope.lockLogin.on("authenticated", function(authResult) {
		lock.getUserInfo(authResult.accessToken, function(error, profile) {
	    if (error) {
	      // Handle error
	      return;
	    }
	    //console.log(profile)
	 	localStorage.setItem("accessToken", authResult.accessToken);
	    localStorage.setItem("profile", JSON.stringify(profile));
	    id_auth0 = profile.sub
	    profile = profile
	    userService.getTokenByIdAuth0(String(id_auth0), function (token) {
	 		// Verificar si el usuario no ha sido registrado con una red social
	 		if (token == null) {
	 			// Verifcar si la autentifiación es por google
	 			if (id_auth0.indexOf('google-oauth2') != -1) {
	 				var data_user = {
	 					name: String(profile.name),
						email: String(profile.email),
						roll: "user",
						auth0Id: id_auth0,
						urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
	 				}
	 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
	 				userService.registerUserBySocialRed(data_user, function (usr) {
	 					// Obtener el token del usuario registrado
	 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
	 						if (profile.email_verified == true) {
	 							$localStorage.token = token	
	 							$state.go('userprofile')
	 						}else{
	 							$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
	 						}
						}, function (err) {
							console.log(err)
						})
	 				}, function (err) {
	 					console.log(err)
	 				})
	 			}
	 			if (id_auth0.indexOf('facebook') != -1) {
	 				var data_user = {
	 					name: String(profile.name),
						email: String(profile.email),
						roll: "user",
						auth0Id: id_auth0,
						urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
	 				}
	 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
	 				userService.registerUserBySocialRed(data_user, function (usr) {
	 					// Obtener el token del usuario registrado
	 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
	 						if (profile.email_verified == true) {
	 							$localStorage.token = token	
	 							$state.go('userprofile')
	 						}else{
	 							$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
	 						}
						}, function (err) {
							console.log(err)
						})
	 				}, function (err) {
	 					console.log(err)
	 				})
	 			}
	 			if (id_auth0.indexOf('auth0') != -1) {
	 				var data_user = {
	 					name: String(profile.name),
						email: String(profile.email),
						roll: "user",
						auth0Id: id_auth0,
						urlImg: "http://res.cloudinary.com/dclbqwg59/image/upload/v1529014920/user_default.png"
	 				}
	 				// Registrar el usuario que ya ha sido registrado en auth0 con una red social
	 				userService.registerUserBySocialRed(data_user, function (usr) {
	 					userService.getTokenByIdAuth0(String(id_auth0), function (token) {
							if (profile.email_verified == true) {
	 							$localStorage.token = token	
	 							$state.go('userprofile')
	 						}else{
								$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
	 						}
						}, function (err) {
							console.log(err)
						})
	 				}, function (err) {
	 					console.log(err)
	 				})
	 			}
	 		}else{
	 			// Si ya existe el usuario		
	 			console.log("login")
	 			console.log("id_auth0 "+ id_auth0)
	 			if (id_auth0.indexOf('auth0') != -1) {
	 				if (profile.email_verified == true) {
	 					$localStorage.token = token	
						if (userService.isTokenValidAsDigdeeper(token)) {
			 				console.log("digdeeperprofile")
			 				$state.go('digdeeperprofile')
			 			}
						if (userService.isTokenValidAsUser(token)) {
							console.log("userprofile")
							$state.go('userprofile')
						}
					}else{
						$rootScope.$emit("openAlert", {textAlert:"Bienvenido a DigDeep, verifica tu cuenta para continuar con el correo que te hemos enviado."})
					}	
	 			}
	 			if (id_auth0.indexOf('google-oauth2') != -1 || id_auth0.indexOf('facebook') != -1) {
	 				$localStorage.token = token	
	 				if (userService.isTokenValidAsDigdeeper(token)) {
		 				console.log("digdeeperprofile")
		 				$state.go('digdeeperprofile')
		 			}
					if (userService.isTokenValidAsUser(token)) {
						console.log("userprofile")
						$state.go('userprofile')
					}
	 			}
	 			
	 		}
	 	}, function (err) {
	 		console.log(err)
			$rootScope.$emit("openAlert", {textAlert:"Lo sentimos tenemos problemas con nuestros servicios intentaló más tarde."})
	 	})
	  });
	});
})
app.filter('rango', function() {
	return function(number) {
	  var res = [];
	  for (var i = 1; i <= number; i++) {
	    res.push(i);
	  }
	  return res;
	};
})
app.constant('APP_SETTINGS',  {
	api: "https://igotomovilapp.herokuapp.com/",
	
	CONEKTA: {
		CONEKTA_API_KEY: 'key_WXs858Ni3rUVsjtfoo9rhAw',
		LANGUAGE: 'es' 
	}
});
app.constant('APP_MESSAGES', {
	CONEKTA: {
		TARJETA_INVALIDA: 'Número de tarjeta inválido',
		FECHA_INVALIDA: 'Fecha de expiración inválida',
		TARJETA_VALIDA: 'Tarjeta válida',
		CVC_INVALIDO: 'El código CVC no es válido',
		TITULAR_REQUERIDO: 'El nombre del titular no puede ser vacío'
	}
});