angular.module('tiendaApp.registroCtrl', ['ui.bootstrap','tiendaApp.registroCtrl'])

.controller('registroCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                    $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openRegistroModal = function () {
        $uibModal.open({
            animation: true,
            templateUrl: '../js/app/templates/modals/registroModal.html',
            controller: 'registroModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            backdrop  : 'static',
            keyboard  : false
        })     
    }

    $rootScope.$on('openRegistroModal', function() {
        $uibModal.open({
            animation: true,
            templateUrl: '../js/app/templates/modals/registroModal.html',
            controller: 'registroModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            backdrop  : 'static',
            keyboard  : false
        })     
    })

}])

.controller('registroModalInstanceCtrl', ['userService', '$rootScope', '$uibModalInstance', '$localStorage', '$scope','$state', '$http',
function (                                 userService,  $rootScope,   $uibModalInstance,   $localStorage,   $scope,  $state,   $http) {
    
    $scope.usr = {
        email: "",
        password: ""
    }
    this.goForgetPassword = function () {
        $uibModalInstance.close()
        $scope.usr = {}
        $rootScope.$emit("openRecuperacionPasswordModal")
    }
    this.cancel = function () {
        $uibModalInstance.close()
        $scope.usr = {}
    }
    this.goLogin = function () {
        $uibModalInstance.close()
        $scope.usr = {}
        $rootScope.$emit("openLoginModal")
    }
    this.registrar = function (user) {
        if (validForm(user)) {
            user.idOrigen = 1
            userService.createUser(user, function (token) {
                if (token) {
                    $localStorage.token = token
                    $uibModalInstance.close()
                    $scope.usr = {}
                    obtenerDatosPerfil()
                    alert("Tu registro se ha creado correctamente")
                    location.reload()
                }else{
                    alert("Este correo ya se encuentra registrado")
                }
            }, function (err) {
                alert("Lo sentimos tenemos problemas con nuestros servicios, intentaló más tarde.")
                console.log(err)
            })
        }
    }
    // Funcion que obtiene los datos del perfil
    function obtenerDatosPerfil() {

        // Se invoca al servicio
        userService.getUser(function (usuario) {
            console.log(usuario)
            // Se obtiene los datos del perfil
            $rootScope.usuario = usuario;
            //$scope.urlImage = response.usuario.imagen;
            // Se verifica si tiene una imagen
            /*if(!$scope.usuario.imagen) {
                $scope.usuario.imagen = 'img/avatar.jpg';
            }*/
        }, function (response) {
            alert("Lo sentimos tenemos problemas con nuestros servicios, intentaló más tarde.")
            console.log(response)
        })
    }
    function validForm(user) {
        var valido = true
        if (user.email == undefined || user.email == "") {
            valido = false
            $scope.alert_message = "Introduce un e-mail valido"
            return false
        }
        if (user.password == undefined || user.password == "") {
            valido = false
            $scope.alert_message = "*Ingresa una contraseña para tu cuenta."
             return false
        }else{
            if (user.password_confirm == undefined || user.password_confirm == "") {
                valido = false
                $scope.alert_message = "*Ingresa la contraseña de confirmación."
                return false
            }else{
                if (user.password != user.password_confirm) {
                    valido = false
                    $scope.alert_message = "*Las contraseñas no coinciden."
                    return false
                }
            }
        }
        $scope.alert_message = ""
        return valido
    }
    
}])

