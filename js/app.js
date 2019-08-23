var app = angular.module('produtosApp', ['ngRoute', 'ngResource']);

app.config(function ($routeProvider) {

    $routeProvider.when('/cadastro', {
        controller: 'CadastroProdutosController',
        templateUrl: 'templates/cadastro.html'
    }).when('/cadastro/:id', {
        controller: 'CadastroProdutosController',
        templateUrl: 'templates/cadastro.html'
    }).when('/tabela', {
        controller: 'TabelaProdutosController',
        templateUrl: 'templates/tabela.html'
    }).otherwise('/tabela');

});

app.controller('TabelaProdutosController', function ($scope, ProdutosService) {

    listar();

    function listar() {
        ProdutosService.listar().then(function (produtos) {
            $scope.produtos = produtos;
        });
    }

    $scope.excluir = function (produto) {
        ProdutosService.excluir(produto).then(listar);
    };
});

app.controller('CadastroProdutosController', function ($routeParams, $scope, $location, ProdutosService) {

    var id = $routeParams.id;

    if (id) {
        ProdutosService.getProduto(id).then(function (produto) {
            $scope.produto = produto;
        });
    } else {
        $scope.produto = {};
    }


    function salvar(produto) {
        $scope.produto = {};
        return ProdutosService.salvar(produto);
    }
    ;

    $scope.salvar = function (produto) {
        $scope.cadastroProdutosForm.$setPristine();
        salvar(produto).then(redirecionarTabela);
    };

    $scope.salvarCadastrarNovo = function (produto) {
        $scope.cadastroProdutosForm.$setPristine();
        salvar(produto);
    };

    function redirecionarTabela() {
        $location.path('/tabela');
    }
    ;

    $scope.cancelar = function () {
        $scope.produto = {};
        redirecionarTabela();
    };
});

app.service('ProdutosService', function (ProdutosResource) {

    this.getProduto = function (id) {
        return ProdutosResource.getProduto({id: id}).$promise;
    };

    this.listar = function () {
        return ProdutosResource.listar().$promise;
    };

    this.salvar = function (produto) {
        if (produto.id) {
            return ProdutosResource.atualizar({id: produto.id}, produto).$promise;
        } else {
            return ProdutosResource.salvar(produto).$promise;
        }
    };

    this.excluir = function (produto) {
        return ProdutosResource.excluir({id: produto.id}).$promise;
    };

});

app.factory('ProdutosResource', function ($resource) {
    return $resource('http://localhost:8080/api/produtos/:id', {}, {
//    return $resource('https://api-rest-produtos-tales.herokuapp.com/api/produtos/:id', {}, {
        atualizar: {
            method: 'PUT'
        },
        listar: {
            method: 'GET',
            isArray: true
        },
        getProduto: {
            method: 'GET'
        },
        salvar: {
            method: 'POST'
        },
        excluir: {
            method: 'DELETE'
        }

    });
});