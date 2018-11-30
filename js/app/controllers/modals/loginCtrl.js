angular.module('tiendaApp.loginCtrl', ['ui.bootstrap','tiendaApp.loginCtrl'])

.controller('loginCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                 $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openLoginModal = function () {
        $uibModal.open({
            animation: true,
            templateUrl: '../js/app/templates/modals/loginModal.html',
            controller: 'loginModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            backdrop  : 'static',
            keyboard  : false
        })     
    }

    $rootScope.$on('openLoginModal', function() {
        $uibModal.open({
            animation: true,
            templateUrl: '../js/app/templates/modals/loginModal.html',
            controller: 'loginModalInstanceCtrl',
            controllerAs: '$ctrl',
            size: 'sm',
            backdrop  : 'static',
            keyboard  : false
        })     
    })

}])

.controller('loginModalInstanceCtrl', ['userService', '$rootScope', '$uibModalInstance', '$localStorage', '$scope','$state', '$http',
function (                              userService,  $rootScope,   $uibModalInstance,   $localStorage,   $scope,  $state,   $http) {
    
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
    this.goRegister = function () {
        $uibModalInstance.close()
        $scope.usr = {}
        $rootScope.$emit("openRegistroModal")
    }
    this.login = function (user) {
        if (validForm(user)) {
            user.idOrigen = 1
            userService.authenticateUser(user, function (token) {
                if (token) {
                    $localStorage.token = token
                    //$scope.usr = {}
                    obtenerDatosPerfil()
                    //alert("Bienvenido a la tienda Solaris")
                    
                }else{
                    alert("Error al iniciar sesión.")
                }
            }, function (err) {
                alert("Lo sentimos tenemos problemas con nuestros servicios, intentaló más tarde.")
                console.log(err)
            })
        }
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
            $scope.alert_message = "*Este campo no puede ser vacio"
            return false
        }
        $scope.alert_message = ""
        return valido
    }
    // Funcion que obtiene los datos del perfil
    function obtenerDatosPerfil() {

        // Se invoca al servicio
        userService.getUser(function (usuario) {
            console.log(usuario)
            // Se obtiene los datos del perfil
            $rootScope.usuario = usuario;
            $uibModalInstance.close()
            location.reload()
            $scope.usr = {}
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
}])

