var app = angular.module('nwuQuiz', ['dndLists']);

angular.module("nwuQuiz")
    .controller("nwuQuizCtrl", function ($scope, $http) {
        $scope.hostname = "ec2-34-244-170-233.eu-west-1.compute.amazonaws.com"
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
                url: `http://${$scope.hostname}:3000/api/frameworkList`
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
                        url: `http://${$scope.hostname}:3000/api/frameworkList`,
                        method: "POST",
                        data: {
                            'model': $scope.models
                        }
                    })
                    .then(function (response) {
                        // success
                        var r = response.data;

                        if (r.result === true) {
                            $scope.getModel();
                            swal("Good job!", r.comment, "success");
                        } else {
                            swal("Derp!", r.comment, "warning");
                        }
                    })
            }
        }
    });