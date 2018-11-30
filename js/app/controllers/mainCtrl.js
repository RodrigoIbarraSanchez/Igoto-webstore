angular.module('tiendaApp.mainCtrl', ['ui.bootstrap'])
.config(['$stateProvider', function ($stateProvider) {
	$stateProvider.state('products', {
		url: '/',
		templateUrl: '/js/app/templates/products.html',
		controller: 'mainCtrl'
	})
}])
.controller('mainCtrl', ['$scope', 'productsService', '$state', '$controller', '$localStorage', '$rootScope', 'userService',
function(				  $scope,   productsService,   $state,   $controller,   $localStorage,   $rootScope,   userService){
	// Cargar controladores para los modales
    angular.extend(this, $controller('registroCtrl', {$scope: $scope}))
    angular.extend(this, $controller('loginCtrl', {$scope: $scope}))
    angular.extend(this, $controller('recuperacionPasswordCtrl', {$scope: $scope}))

	$scope.products = []
	$scope.categories = []
	$scope.currentCategory = null
	$scope.tab = 0
	$rootScope.user = undefined
	if ($localStorage.token) {
		userService.getUser(function (user) {
			$rootScope.user = user	
		}, function (err) {
			alert("Lo sentimos tenemos problemas con nuestros servicios")
		})
	}
	getCategoriesFather()
	getMenu()
	$scope.getProductsByCategory = getProductsByCategory
	productsService.getProductsDestacados(function (productos) {
		console.log(productos);
		$scope.products = productos
	}, function (err) {
		console.log(err);
	})

	function getMenu() {
		productsService.getCategories(function (categories) {
			console.log(categories)
			$scope.categories = categories
		},function (err) {
			console.log(err)
		})
	}
	// Obtener todas las categorias Padre
	function getCategoriesFather() {
		productsService.getCategoriesFather(function (categories) {
			$scope.categoriesFather = categories
			//$scope.currentCategory = $scope.categories[0]._id
			//getProductsByCategory($scope.currentCategory)
		},function (err) {
			console.log(err)
		})
	}
	$scope.statusOpen = false	
	$scope.getProductsByCategory = function(id_cat, id_proveniente) {
		$scope.statusOpen = true
		$scope.fatherID = id_cat
		// Se invoca al servicio
		productsService.findAllChildrensByFather(id_proveniente, function(categories) {
			console.log(categories);
			// Se obtiene la respuesta
			if (categories && categories.length == 0) {
				$scope.statusOpen = false
				catalogoCategoriasNieto = []
				//$rootScope.mostrarProductos(id_cat)
				//$ionicSideMenuDelegate.toggleLeft();
				$scope.currentCategory = id_cat
				//$scope.tab = indextab
				getProductsByCategory($scope.currentCategory)
			}else{
				$scope.catalogoCategoriasHijo = categories;
				$scope.catalogoCategoriasNieto = []
			}	
		}, function (err) {
			console.log(err);
		});
	}
	$scope.getCategoriesByFather = function(id_cat, id_proveniente) {
		$scope.statusOpen = true
		$scope.fatherID = id_cat
		// Se invoca al servicio
		productsService.findAllChildrensByFather(id_proveniente, function(categories) {
			console.log(categories);
			// Se obtiene la respuesta
			if (categories && categories.length == 0) {
				$scope.statusOpen = false
				catalogoCategoriasNieto = []
				//$rootScope.mostrarProductos(id_cat)
				//$ionicSideMenuDelegate.toggleLeft();
				$scope.currentCategory = id_cat
				//$scope.tab = indextab
				getProductsByCategory($scope.currentCategory)
			}else{
				$scope.catalogoCategoriasHijo = categories;
				$scope.catalogoCategoriasNieto = []
			}	
		}, function (err) {
			console.log(err);
		});
	}

	$scope.getCategoriesBySon = function(id_cat, id_proveniente) {
		// Se invoca al servicio
		productsService.findAllGrandSonByFather(id_proveniente, function(categories) {
			console.log(categories);
			// Se obtiene la respuesta
			if (categories && categories.length == 0) {
				$scope.statusOpen = false
				catalogoCategoriasNieto = []
				//$rootScope.mostrarProductos(id_cat)
				//$ionicSideMenuDelegate.toggleLeft();
				$scope.currentCategory = id_cat
				//$scope.tab = indextab
				getProductsByCategory($scope.currentCategory)
			}else{
				$scope.catalogoCategoriasNieto = categories;
			}	
		}, function (err) {
			console.log(err);
		});
	}
	$scope.selectCategory = function (cat,indextab) {
		$scope.currentCategory = cat
		$scope.tab = indextab
		getProductsByCategory($scope.currentCategory)
	}
	function getProductsByCategory(idCat,offset,noElements) {
		$scope.statusOpen = false
		productsService.getProductsByCategory(idCat,offset,noElements,function (productos) {
			$scope.products = productos
			console.log(productos)
		},function (err) {
			console.log(err)
		})
	}
	$rootScope.logout = function () {
		delete $localStorage.token
		location.reload()
	}
}])