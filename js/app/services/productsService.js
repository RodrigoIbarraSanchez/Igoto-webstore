angular.module('tiendaApp.productsService', [])
.service('productsService', ['$http', 'APP_SETTINGS',
function(					  $http,   APP_SETTINGS){
	var api = APP_SETTINGS.api
	var apiUrlProducts 		= api+"apilanding/products"
	var apiUrlCategories 	= api+"apilanding/categories"
	var apiUrlCategoriesFather 	= api+"apilanding/categorias_padre"
	var apiUrlCategoriesSon 	= api+"apilanding/categorias_hijo"
	var apiUrlCategoriesGrandSon= api+"apilanding/categorias_nieto"
	
	this.getProductsByCategory = function (idcat,offset,noElements,onSuccess, onError) {
		var data = {
			offset: offset,
			noElements: noElements
		}
		$http.post(apiUrlProducts+"/"+idcat,data)
		.then(function (response) {
			if (response.data.status === "success") {
				onSuccess(response.data.productos)
			}else{
				onError(response.data.message)
			}
		},onError)
	}
	this.getProductsDestacados = function (onSuccess, onError) {
		$http.get(api+"api/producto/destacados/10/0")
		.then(function (response) {
			console.log("destacados");
			console.log(response);
			if (response.data.success) {
				onSuccess(response.data.productos)
			}else{
				onError(response.data.message)
			}
		},onError)
	}

	this.getProduct = function (id,onSuccess, onError) {
		$http.get(apiUrlProducts+"/"+id)
		.then(function (response) {
			if (response.data.status === "success") {
				onSuccess(response.data.producto)
			}else{
				onError(response.data.message)
			}
		},onError)
	}

	this.getCategories = function (onSuccess, onError) {
		$http.get(apiUrlCategories)
		.then(function (response) {
			if (response.data.status === "success") {
				onSuccess(response.data.categorias)
			}else{
				onError(response.data.message)
			}
		},onError)
	}

	this.getCategoriesFather = function (onSuccess, onError) {
		$http.get(apiUrlCategoriesFather)
		.then(function (response) {
			if (response.data.status === "success") {
				onSuccess(response.data.categorias)
			}else{
				onError(response.data.message)
			}
		},onError)
	}
	this.findAllChildrensByFather = function (id_proveniente, onSuccess, onError) {
		$http.get(apiUrlCategoriesSon+"/"+id_proveniente)
		.then(function (response) {
			if (response.data.status === "success") {
				onSuccess(response.data.categorias)
			}else{
				onError(response.data.message)
			}
		},onError)
	}
	this.findAllGrandSonByFather = function (id_proveniente, onSuccess, onError) {
		$http.get(apiUrlCategoriesGrandSon+"/"+id_proveniente)
		.then(function (response) {
			if (response.data.status === "success") {
				onSuccess(response.data.categorias)
			}else{
				onError(response.data.message)
			}
		},onError)
	}

}])