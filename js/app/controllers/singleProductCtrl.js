angular.module('tiendaApp.singleProductCtrl', [])
.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('singleproduct', {
		url: '/singleproduct:idproduct',
		templateUrl: '/js/app/templates/single.html',
		controller: 'singleProductCtrl'
	})
}])

.controller('singleProductCtrl', ['$rootScope','$scope', 'productsService','$state', '$stateParams', '$localStorage', 'userService',
function(				  		   $rootScope,  $scope,   productsService,  $state,   $stateParams,   $localStorage,   userService){
	$scope.producto = {}
	var selectedCaracteriticas = [];
	//JSON que obtendra el numero de piezas seleccionadas por el usuario
	$scope.selectPiezas = {
		noPiezas: 1
	};
	reloadProduct($stateParams.idproduct)
	if ($localStorage.token) {
		userService.getUser(function (user) {
			$rootScope.user = user	
		}, function (err) {
			alert("Lo sentimos tenemos problemas con nuestros servicios")
		})
	}
	function reloadProduct(id_product) {
		productsService.getProduct(id_product, function (product) {
			//console.log(product)
			$scope.producto = product
		},function (err) {
			console.log("err")
		})
	}
	$scope.irComprar = function () {
		//agregarCarrito(true)
		if ($localStorage.token) {
			agregarCarrito(true)
		}else{
			$rootScope.$emit("openLoginModal")
		}
	}
	/**
	 * Funcion que agrega un producto al carrito de compras		 
	 */
	function agregarCarrito(flagCompra){
		//Si el producto no tiene piezas disponibles
		if ($scope.producto.piezasDisponibles <= 0) {
			//notifica cuando el producto se encuentra agotado ya que no tiene piezas disponibles
			return alert('Producto agotado', 'Lo sentimos este producto se encuentra agotado.');
		}
		
		//Si el producto cuenta con colores y no se ha seleccionado alguno
		if ($scope.producto.colores.length > 0 && !$scope.selectedColor) {
			//notifica que seleccione algun color
			return alert('Selecciona el color de tu preferencia para el producto.');
		}			
		
		//Si el producto cuenta con caracterisiticas
		if ($scope.producto.caracteristicas.length > 0) {
			//Se verifica que todas hayan sido seleccionadas
			var longitud = $scope.producto.caracteristicas.length;
			if (longitud !== selectedCaracteriticas.length) {					
				return alert('Selecciona las caracterisiticas para tu producto.');
			}
		}

		//Se crea el objeto producto para el carrito
		var productItem = {
			_id: $scope.producto._id,
			color: $scope.selectedColor,
			caracteristicas: selectedCaracteriticas,
			noPiezas: $scope.selectPiezas.noPiezas
		};			

		//Se agrega el producto al carrito
		var productosCarrito = JSON.parse(localStorage.getItem('productos_carrito')) || [];
			productosCarrito.push(productItem);
			localStorage.setItem('productos_carrito', JSON.stringify(productosCarrito));
		alert('Su producto ha sido agregado exitosamente al carrito');
		//Se redirecciona a la seccion de caja
		if (flagCompra) {
			$state.go('caja');
		}
	}
	/**
	 * Funcion que agrega la caracteristica seleccionada para el producto del carrito
	 * @param {String} caracteristica nombre
	 * @param {String} valor          Valor de la caracteristica seleccionada
	 */
	$scope.addCaracteristica = function(caracteristica, valor){
		//flag para corroborar si la caracteristica ya ha sido agregada
		var exist = false;
		//Se itera sobre las caracteristicas
		for(var i in selectedCaracteriticas){
			//Si existe la caracteristica
			if (selectedCaracteriticas[i].caracteristica === caracteristica) {
				//Se actualiza su valor y la bandera cambia a true de que existe
				selectedCaracteriticas[i].valor = valor;
				exist = true;
				break;
			}
		}
		//Si la caracteristica no existe
		if (!exist) {
			//Se agrega la caracteristica nueva
			selectedCaracteriticas.push({caracteristica: caracteristica, valor: valor});
		}
	}

	$scope.notificacionPiezas = function($event){
		//Si el usuario selecciona mas de dos piezas y el producto tiene variedad de colores y caracteristicas
		/*if ($scope.selectPiezas.noPiezas > 1 && ( ($scope.producto.colores && $scope.producto.colores.length > 0) || ($scope.producto.caracteristicas && $scope.producto.caracteristicas.length > 0) ) ) {
			//console.log('show modal');
			//Se muestra modal
			$scope.popover.show($event);
		}*/
	}
	$rootScope.logout = function () {
		delete $localStorage.token
		$state.go('products')
	}
}])