angular.module('tiendaApp.cajaCtrl', [])
.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('caja', {
		url: '/caja',
		templateUrl: '/js/app/templates/caja.html',
		controller: 'cajaCtrl'
	})
}])
.controller('cajaCtrl', ['conektaService','$window', 'pedidoService', '$scope', 'productsService', '$state', '$timeout', 'userService', 'catalogoMetodosPagosService', 'catalogoEstadoService', '$localStorage', '$rootScope',
function (				  conektaService,  $window,   pedidoService,   $scope,   productsService,   $state,   $timeout,   userService,   catalogoMetodosPagosService,   catalogoEstadoService,   $localStorage,   $rootScope) {
	var productos = [];
	$scope.anios = [];
	$scope.load = true;
	$scope.pedido = {
		usuario: {
			direccionEnvio:{}
		}
	}; //objeto que contendra la informacion del pedido a comprar
	$scope.usuario = {};
	$scope.tarjeta = {}; // Informacion de la tarjeta
	$scope.totalPagar = 0;
	$scope.listaEstado = [];
	$scope.listaProductos = [];
	$scope.listaMetodosPago = [];
	$scope.procesarCompra = false;
	$scope.procesandoCompra = false
	$scope.isPrimeraCompra = true;
	if ($localStorage.token) {
		userService.getUser(function (user) {
			$rootScope.user = user	
		}, function (err) {
			alert("Lo sentimos tenemos problemas con nuestros servicios")
		})
	}
	init()

	function init() {
		$scope.totalPagar = 0;
		$scope.listaProductos = [];
		var anioActual = new Date().getFullYear();
		// Se itera 
		for(var i = 0; i < 10;i++) {
			$scope.anios.push(anioActual++);
		}
		findAllEstados(); // Se obtiene la lista de estados
		findAllMetodosPago(); // Se obtiene la lista de metodos de pago
		obtenerDatosUsuario(); // Se obtiene la informacion del usuario
		// Se verifica si existen productos para efectuar el pago
		if(localStorage.getItem('productos_carrito')) {

			// Se recupera la lista de productos a pagar
			productos = JSON.parse(localStorage.getItem('productos_carrito'));

			// Se verifica si el tamanio de la lista es mayor que 0
			if(productos.length > 0) {

				// Se itera la lista
				for(var j = 0; j < productos.length; j++) {
					obtenerListaProductos(productos[j]);						
					if((j + 1) == productos.length) {
						$scope.load = false;
					}
				}
				console.log($scope.listaProductos)
			} else {
				$scope.load = false;
			}
		} else {
			$scope.load = false;
		}
	}
	$scope.ShowConfirm = function () {
        if ($window.confirm("Confirma que todos tus datos esten correctos")) {
            $scope.Message = "You clicked YES.";
            $scope.isPrimeraCompra = false;
			$scope.realizarPago();
        } else {
        	$scope.procesandoCompra = false
            $scope.Message = "You clicked NO.";
            return false
        }
        console.log($scope.Message)
    }
	// Funcion que obtiene la informacion de los productos
	function obtenerListaProductos(producto) {

		// Se valida si existe al menos una caracteristica
		if(producto.caracteristicas && producto.caracteristicas.length > 0) {
			
			for(var i = 0; i < producto.caracteristicas.length; i++) {
				
				producto.caracteristicas[i] = {
					valor: producto.caracteristicas[i].valor,
					nombre: producto.caracteristicas[i].caracteristica
				};
			}
		}

		// Se invoca al servicio
		productsService.getProduct(producto._id, function (product) {
			// Se verifica si la respuesta fue exitosa
			if(product) {
				product.color = producto.color;
				product.noPiezas = parseInt(producto.noPiezas);
				product.caracteristicas = producto.caracteristicas;
				$scope.listaProductos.push(product);
				$scope.totalPagar += (product.precio * product.noPiezas) + product.costoEnvio;
			}
		}, function (err) {
			console.log(err)
			alert("Lo sentimos tenemos problemas con nuestros servicios.")
		})
	}
	function findAllMetodosPago() {
		catalogoMetodosPagosService.getMethodsPay(function (catalogo) {
			$scope.listaMetodosPago = catalogo
			//console.log(catalogo)
		}, function (err) {
			console.log(err)	
		})
	}
	function findAllEstados() {
		catalogoEstadoService.getEstados(function (catalogo) {
			$scope.listaEstado = catalogo
			//console.log(catalogo)
		}, function (err) {
			console.log(err)	
		})
	}
	// Funcion que eliminar un producto de la lista
	$scope.eliminarProducto = function(idProducto) {

		// Se itera la lista
		for(var i = 0; i < productos.length; i++) {
			
			// Se verifica el id de producto
			if(productos[i]._id == idProducto) {
				productos.splice(i, 1);
				localStorage.setItem('productos_carrito', JSON.stringify(productos));
				break;
			}
		}
		init();
	}
	// Funcion que obtiene los datos del usuario
	function obtenerDatosUsuario() {
		// Se invoca a la api
		userService.getUser(function (usuario) {
			// Se obtiene el los datos del usuario
			$scope.usuario = usuario;
			obtenerDatosTarjeta(usuario.customer);
			obtenerListaProductosPorUsuario($scope.usuario._id);
		}, function (err) {
			alert("Lo sentimos tenemos problemas con nuestros servicios.")
		})
	}
	// Se obtiene los datos de la tarjeta
	function obtenerDatosTarjeta(customer) {
		// Se verifica si existe un customer
		if(customer && customer.id) {
			// Se invoca al servicio
			userService.obtenerDatosTarjetaUsuario(customer.id, function (tarjeta) {
				$scope.tarjeta = tarjeta;
				console.log(tarjeta)
			}, function (err) {
				console.log(err)
				alert("Lo sentimos tenemos problemas con nuestros servicios.")
			})
		}
	}

	// Se obtiene la lista de productos
	function obtenerListaProductosPorUsuario(idUsuario) {
		$scope.isPrimeraCompra = true;
		// Se invoca el servicio
		pedidoService.obtenerListaProductosPorUsuario(idUsuario, function (listaProductos) {
			if(listaProductos.length > 0) {
				$scope.isPrimeraCompra = false;
			}
		}, function (err) {
			console.log(err)
			//alert("Lo sentimos tenemos problemas con nuestros servicios.")
		})
	}
	function validarDireccion() {
		console.log($scope.usuario)
		console.log($scope.pedido.usuario)
		if ($scope.usuario == undefined ) {}
		if ($scope.usuario.direccionEnvio.calle == undefined && $scope.pedido.usuario.direccionEnvio.calle == undefined) {
			console.log("here1")
			return false
		}
		if ($scope.usuario.direccionEnvio.estado == undefined && $scope.pedido.usuario.direccionEnvio.estado == undefined) {
			console.log("here2")
			return false
		}
		if ($scope.usuario.direccionEnvio.telefono == undefined && $scope.pedido.usuario.direccionEnvio.telefono == undefined) {
			console.log("here3")
			return false
		}
		if ($scope.usuario.direccionEnvio.municipio == undefined && $scope.pedido.usuario.direccionEnvio.municipio == undefined) {
			console.log("here4")
			return false
		}
		if ($scope.usuario.direccionEnvio.numero == undefined && $scope.pedido.usuario.direccionEnvio.numero == undefined) {
			console.log("here5")
			return false
		}
		if ($scope.usuario.direccionEnvio.codigoPostal == undefined && $scope.pedido.usuario.direccionEnvio.codigoPostal == undefined) {
			console.log("here6")
			return false
		}
		return true
	}
	// Funcion que evalua el tipo de pago con el que
	// realizará la transaccion
	$scope.realizarPago = function() {
		$scope.procesandoCompra = true
		if ($localStorage.token == undefined) {
			$scope.procesandoCompra = false
			alert('Lo sentimos para poder comprar productos en nuestra app, necesitas registrarte.')
			return false
		}
		// Se verifica si es su primera compra
		if($scope.isPrimeraCompra) {

			/*return $ionicPopup.show({
				title: 'Confirmar pago',
				template: 'Confirme que sus datos sean correctos, en caso de no ser ' +
						  'así la empresa no se hace responsable por entregas no completadas',
				buttons: [
					{ text: 'Cancelar' },
					{
						text: '<b>Aceptar</b>',
						type: 'button-positive',
						onTap: function(e) {
							$scope.isPrimeraCompra = false;
							realizarPago();
						}
					}
				]
			});*/
			$scope.ShowConfirm()
		}
		
		$scope.pedido.monto = $scope.totalPagar;
		$scope.pedido.productos = $scope.listaProductos;
		console.log($scope.pedido.usuario.direccionEnvio)
		console.log($scope.usuario.direccionEnvio)

		if ($scope.usuario.direccionEnvio.calle == undefined && $scope.pedido.usuario.direccionEnvio.calle == undefined) {
			alert("La dirección de la calle no puede ser vacio.")
			$scope.procesarCompra = false;
			$scope.procesandoCompra = false;
			return false
		}
		if ($scope.usuario.direccionEnvio.estado == undefined && $scope.pedido.usuario.direccionEnvio.estado == undefined) {
			alert("El estado no puede ser vacio.")
			$scope.procesarCompra = false;
			$scope.procesandoCompra = false;
			return false
		}
		if ($scope.usuario.direccionEnvio.telefono == undefined && $scope.pedido.usuario.direccionEnvio.telefono == undefined) {
			alert("El número de teléfono no puede ser vacio.")
			$scope.procesarCompra = false;
			$scope.procesandoCompra = false;
			return false
		}
		if ($scope.usuario.direccionEnvio.municipio == undefined && $scope.pedido.usuario.direccionEnvio.municipio == undefined) {
			alert("El municipio no puede ser vacio.")
			$scope.procesarCompra = false;
			$scope.procesandoCompra = false;
			return false
		}
		if ($scope.usuario.direccionEnvio.numero == undefined && $scope.pedido.usuario.direccionEnvio.numero == undefined) {
			alert("El número de domicilio no puede ser vacio.")
			$scope.procesarCompra = false;
			$scope.procesandoCompra = false;
			return false
		}
		if ($scope.usuario.direccionEnvio.codigoPostal == undefined && $scope.pedido.usuario.direccionEnvio.codigoPostal == undefined) {
			alert("El codigo postal no puede ser vacio.")
			$scope.procesarCompra = false;
			$scope.procesandoCompra = false;
			return false
		}
		$scope.pedido.usuario = {
			_id: $scope.usuario._id,
			email: $scope.usuario.email,
			apellidos: $scope.usuario.apellidos || $scope.pedido.usuario.apellidos,
			nombreCompleto: $scope.usuario.nombreCompleto || $scope.pedido.usuario.nombreCompleto,
			direccionEnvio: {
				calle: $scope.usuario.direccionEnvio.calle || $scope.pedido.usuario.direccionEnvio.calle,
				estado: $scope.usuario.direccionEnvio.estado || $scope.pedido.usuario.direccionEnvio.estado,
				telefono: $scope.usuario.direccionEnvio.telefono || $scope.pedido.usuario.direccionEnvio.telefono,
				municipio: $scope.usuario.direccionEnvio.municipio || $scope.pedido.usuario.direccionEnvio.municipio,
				numero: $scope.usuario.direccionEnvio.numero || $scope.pedido.usuario.direccionEnvio.numero,
				codigoPostal: $scope.usuario.direccionEnvio.codigoPostal || $scope.pedido.usuario.direccionEnvio.codigoPostal,
			},
			customer: $scope.usuario.customer || $scope.pedido.usuario.customer,
		};
		

		// Se verifica el tipo de metodo de pago
		switch($scope.pedido.metodoPago) {
			case 1:

				$scope.procesarCompra = true;
				/*$ionicLoading.show({
					template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
				});*/

				// Se verifica si ya tiene un token
				if(!$scope.usuario.customer || !$scope.usuario.customer.id) {

					// Se verifica si la tarjeta es valida
					var validarTarjeta = conektaService.validarTarjeta($scope.tarjeta);
					console.log(validarTarjeta)
					// Si la tarjeta es valida
					if(validarTarjeta.success) {

						// Se invoca al servicio
						conektaService.tokenizar($scope.tarjeta).then(function(response) {

							// Se verifica si la respuesta fue existosa
							if(response && response.success) {
								pagarTarjeta(response.token.id); // Se paga con tarjeta
							} else {
								//$ionicLoading.hide();
								$scope.procesarCompra = false;
								$scope.procesandoCompra = false
								//alertPopup('Notificación', response.message || 'Ocurrio un error al validar la tarjeta');
								alert('Ocurrio un error al validar la tarjeta, '+response.message)
							}
						});
					} else {
						//$ionicLoading.hide();
						$scope.procesarCompra = false;
						$scope.procesandoCompra = false;
						//alertPopup('Notificación', validarTarjeta.descripcion);
						alert("Error al validar la tarjeta, "+validarTarjeta.message)
					}
				} else {
					pagarTarjeta(); // Se paga con tarjeta
				}

				break;
			case 2:
				pagarTransferencia();
				break;
			case 3:
				pagarEnEfectivo();
				break;
			case 4: 
				prepago();
				break;
			case 5:
				prepago();
				break;
			default:
				$scope.procesarCompra = false;
				$scope.procesandoCompra = false;
				alert('Seleccione un método de pago.');
		}
	}
	// Se paga mediante el metodo de pago por Oxxo
	function pagarEnEfectivo() {

		$scope.procesarCompra = true;
		/*$ionicLoading.show({
			template: '<p>Espere</p><ion-spinner icon="lines"></ion-spinner>',
		});*/
		
		// Se invoca al servicio
		pedidoService.registrarPedidoEfectivo($scope.pedido, function (success) {
			$scope.procesarCompra = false;
			if(success) {
				localStorage.removeItem('productos_carrito');
				$state.go('products')
				alert('¡Ya estuvo, prepárate para recibir y disfrutar!');
			} 
		}, function (err) {
			console.log(err)
			alert('Error al realizar el pago.');
		})
	}
	// Funcion que realiza el pago mediante spei
	function pagarTransferencia() {

		$scope.procesarCompra = true;
		$scope.procesandoCompra = true;
		// Se invoca al servicio
		pedidoService.registrarPedidoTransferencia($scope.pedido, function(success) {
			$scope.procesandoCompra = false
			$scope.procesarCompra = false;	
			// Se verifica si la respuesta fue correcta
			if(success) {
				localStorage.removeItem('productos_carrito');
				$state.go('products')
				alert('¡Ya estuvo, prepárate para recibir y disfrutar!');
				
			} else {
				alert('Error al realizar el pago.');
			}
		}, function (err) {
			console.log(err)
			alert('Error al realizar el pago. '+err);
		});
	}
	// Funcion que realiza el pago mediante tarjeta
	function pagarTarjeta(tokenId) {
		
		// Se invoca al servicio
		pedidoService.registrarPedidoTarjeta($scope.pedido, tokenId, function (success) {
			if(success) {

				localStorage.removeItem('productos_carrito');
				$state.go('products')
				alert('¡Ya estuvo, prepárate para recibir y disfrutar!');
			} else {
				alert('Notificación', 'Error al realizar el pago.');
			}
		}, function (err) {
			console.log(err)
			alert('Error al realizar el pago.');
		})
		/*pedidoService.registrarPedidoTarjeta($scope.pedido, tokenId).then(function(response) {

			$ionicLoading.hide();
			$scope.procesarCompra = false;
			
			// Se verifica si la respuesta fue correcta
			if(response.success) {

				localStorage.removeItem('productos_carrito');
				alertPopup('Notificación', '¡Ya estuvo, prepárate para recibir y disfrutar!', true);

				$timeout(function() {
					alert.close();
					$ionicHistory.clearCache().then(function () {
						$state.go('app.main');
					});
				}, 5000);
			} else {
				alertPopup('Notificación', 'Error al realizar el pago.');
			}
		});*/
	}
	$rootScope.logout = function () {
		delete $localStorage.token
		$state.go('products')
	}
}]);