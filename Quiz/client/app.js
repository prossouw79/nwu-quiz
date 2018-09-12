var app = angular.module('nwuQuiz', ['dndLists']);

angular.module("nwuQuiz")
    .controller("nwuQuizCtrl", function ($scope, $http) {
        $scope.models = {
            selected: null,
            lists: {
                Icons: {
                    allowedTypes: ['Icon'],
                    items: []
                },
                Names: {
                    allowedTypes: ['Name'],
                    items: []
                },
                Descriptions: {
                    allowedTypes: ['Description'],
                    items: []
                },
            }
        };
        $scope.email = "";

        $scope.getModel = function () {
            $http({
                method: 'GET',
                url: `/api/frameworkList`
            }).then(function successCallback(response) {
                console.log(`Response: ${response}`);
                if (response.data) {
                    $scope.models.lists = response.data;
                }
            }, function errorCallback(response) {
                console.log(`Error: ${response}`);

            });
        }

        function init() {
            $scope.getModel();
        }

        init()



        function validateEmail(email) {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(String(email).toLowerCase());
        }

        $scope.sendModel = function () {
            if (!validateEmail($scope.email)) {
                swal("Invalid email!", `'${$scope.email}' failed email validations!`, "error").then(function () {
                    document.getElementById("email").focus();
                })
            } else {

                $scope.models.email = $scope.email;
                $http({
                        url: `/api/frameworkList`,
                        method: "POST",
                        data: {
                            'model': $scope.models
                        }
                    })
                    .then(function (response) {
                        // success
                        var r = response.data;

                        if (r.result === true) {
                            swal("Good job!", r.comment, "success");
                            $scope.getModel();
                        } else {
                            swal("Derp!", r.comment, "warning");
                        }
                    })
            }
        }
    });