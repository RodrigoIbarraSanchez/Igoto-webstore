angular.module('tiendaApp.recuperacionPasswordCtrl', ['ui.bootstrap'])

.controller('recuperacionPasswordCtrl', ['$rootScope', '$scope', '$uibModal', '$document',
function (                                $rootScope,   $scope,   $uibModal,   $document) {
    
    $scope.openRecuperacionPasswordModal = function () {
        $uibModal.open({
            animation: true,
            templateUrl: '../js/app/templates/modals/recuperacionPassword.html',
            controller: 'recuperacionPasswordModalInstance',
            controllerAs: '$ctrl',
            size: 'sm',
            backdrop  : 'static',
            keyboard  : false
        })     
    }

    $rootScope.$on('openRecuperacionPasswordModal', function() {
        $uibModal.open({
            animation: true,
            templateUrl: '../js/app/templates/modals/recuperacionPassword.html',
            controller: 'recuperacionPasswordModalInstance',
            controllerAs: '$ctrl',
            size: 'sm',
            backdrop  : 'static',
            keyboard  : false
        })     
    })

}])

.controller('recuperacionPasswordModalInstance', ['userService', '$rootScope', '$uibModalInstance', '$localStorage', '$scope','$state', '$http',
function (                                         userService,   $rootScope,   $uibModalInstance,   $localStorage,   $scope,  $state,   $http) {
    $scope.email = ""
    this.forgetPassword = function (email) {
       if (email != undefined && email != '') {
            userService.recuperarContrasenia(email, function (success) {
                if (success) {
                    $uibModalInstance.close()
                    alert('Se ha enviado una nueva contraseña a su correo.')
                }else{
                    console.log(err)
                    alert("Lo sentimos tenemos problemas con nuestros servicios.")
                }
            }, function (err) {
                console.log(err)
                alert("Lo sentimos tenemos problemas con nuestros servicios.")
            })
       }
    }
    this.cancel = function () {
        $uibModalInstance.close()
        $scope.email = undefined
    }
    this.goRegister = function () {
        $uibModalInstance.close()
        $scope.email = undefined
        $rootScope.$emit("openRegistroModal")
    }
    this.goLogin = function () {
        $uibModalInstance.close()
        $scope.email = undefined
        $rootScope.$emit("openLoginModal")
    }
}])

