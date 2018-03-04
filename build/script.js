angular.module("foodgics", [
	"ngRoute",

	"foodgics.food",
	"foodgics.home",
	"foodgics.navigation",
	"foodgics.search",
	"foodgics.login",
	"foodgics.profile",
	"foodgics.session",
]);

angular.module("foodgics.api", [
    "foodgics.api.foods",
    "foodgics.api.users",
]);

angular.module("foodgics.boxes", [
	"foodgics.diet",
]);

angular.module("foodgics.diet", []);

angular.module("foodgics.food", [
	"foodgics.session",

	"monospaced.elastic",
]);

angular.module("foodgics.home", [
	"foodgics.session"
]);

angular.module("foodgics.login", [
	"foodgics.session",
]);

angular.module("foodgics.navigation", [
	"foodgics.session",
]);

angular.module("foodgics.profile", []);

angular.module("foodgics.search", [
    "foodgics.api",
    "foodgics.boxes",
]);

angular.module("foodgics.session", []);
angular.module("foodgics.utils", []);

angular.module("foodgics.api.foods", [
	"foodgics.utils",
	"foodgics.session"
]);

angular.module("foodgics.api.users", [
	"foodgics.session",
]);

angular.
module("foodgics").
config(function($routeProvider) {
	"use strict";

	$routeProvider
		.when("/", {
			controller:"HomeController",
			controllerAs: "vm",
			templateUrl:"html/home/home-controller.html",
		})

		.when("/search", {
			controller:"SearchController",
			controllerAs: "vm",
			templateUrl:"html/search/search-controller.html",
			menuItem: "search",
		})

		.when("/information/:id", {
			controller: "InformationController",
			controllerAs: "vm",
			templateUrl: "html/food/information-controller.html",
		})

		.when("/create", {
			controller: "EditController",
			controllerAs: "vm",
			templateUrl: "html/food/edit-controller.html",
			menuItem: "create",
		})

		.when("/edit/:id", {
			controller: "EditController",
			controllerAs: "vm",
			templateUrl: "html/food/edit-controller.html",
		})

		.when("/login", {
			controller: "LoginController",
			controllerAs: "vm",
			templateUrl: "html/login/login-controller.html",
			menuItem: "login",
		})

		.when("/sign-up", {
			controller: "SignUpController",
			controllerAs: "vm",
			templateUrl: "html/login/sign-up-controller.html",
			menuItem: "login",
		})

		.when("/profile", {
			controller: "ProfileController",
			controllerAs: "vm",
			templateUrl: "html/profile/profile-controller.html",
			menuItem: "profile",
		})

		.when("/contact", {
			templateUrl:"html/about/contact-controller.html",
			menuItem: "contact",
		})

		.when("/about", {
			templateUrl:"html/about/about-controller.html",
			menuItem: "about",
		})

		.otherwise({
			redirectTo:"/",
		});
});

angular.
module("foodgics").
run(function foodgicsRun(
	$rootScope,
    $location,
    $window,
    fgActiveMenuItem,
	fgFacebook
) {
	"use strict";

	$rootScope.$on('$routeChangeSuccess', function(scope, current) {
		fgActiveMenuItem.setItem(current.$$route.menuItem);

		$window.ga('send', 'pageview', { page: $location.url() });
	});

	fgFacebook.getLoginStatus().then(function loginSuccess() {
		console.log("login success.")
	}, function loginFailed() {
		console.log("login failed.")
	});
});

angular.
module("foodgics.api").
factory("fgApi", function apiService(
    fgFoods,
    fgUsers
) {
    "use strict";

    return {
        foods: fgFoods,
        users: fgUsers,
    };
});

angular.
module("foodgics.boxes").
component("fgContains", {
	controller: "FgContainsController",
	controllerAs: "vm",
	templateUrl: "html/boxes/contains-component.html",
	bindings: {
		food: "=",
	},
});

angular.
module("foodgics.boxes").
controller("FgContainsController", function ContainsController(
	fgAllergen,
	fgDiet
) {
	"use strict";

	this.fgAllergen = fgAllergen;
	this.fgDiet = fgDiet;

	this.contains = function contains(allergen) {
		if (!this.food) {
			return true;
		}

		return !!(this.food.allergen & allergen);
	};

	this.diet = function diet(diet) {
		if (!this.food) {
			return false;
		}

		return !!(this.food.diet & diet);
	};
});

angular.
module("foodgics.boxes").
component("filterComponent", {
	controller: "FilterController",
	controllerAs: "vm",
	templateUrl: "html/boxes/filter-component.html",
	bindings: {
		filter: "&",
	},
});

angular.
module("foodgics.boxes").
controller("FilterController", function FilterController(
	fgAllergen,
	fgDiet
) {
	"use strict";

	this.fgAllergen = fgAllergen;
	this.fgDiet = fgDiet;

	var allergen = 0;
	var diet = 0;

	this.toggleAllergy = function toggleAllergy(allergyEvent) {
		var element = angular.element(allergyEvent.currentTarget);

		element.toggleClass("active");
		allergen = allergen ^ parseInt(element.attr("value"), 10);

		this.filter({
			allergenFilter: allergen,
			dietFilter: diet,
		});
	};

	this.toggleDiet = function toggleAllergy(dietEvent) {
		var element = angular.element(dietEvent.currentTarget);

		element.toggleClass("active");
		diet = diet ^ parseInt(element.attr("value"), 10);

		this.filter({
			allergenFilter: allergen,
			dietFilter: diet,
		});
	};
});

angular.module("foodgics.boxes").component("fgWarningBox", {
	templateUrl: "html/boxes/warning-box-component.html",
	controller: angular.noop,
	controllerAs: "vm",
	bindings: {},
});

angular.
module("foodgics.diet").
value("fgAllergen", {
	Nuts: 1 << 0,
	Gluten: 1 << 1,
	MilkProtein: 1 << 2,
	Almonds: 1 << 3,
	All: (1 << 4) - 1,
});

angular.
module("foodgics.diet").
value("fgDiet", {
	Vegan: 1 << 0,
	Vegetarian: 1 << 1,
});

angular.
module("foodgics.food").
controller("EditController", function EditController(
	$window,
	$routeParams,
	$location,
	fgAllergen,
    fgDiet,
    fgApi
) {
	"use strict";

	var self = this;

	this.fgAllergen = fgAllergen;
	this.fgDiet = fgDiet;

	this.food = {
		allergen: fgAllergen.All,
		diet: 0,
	};

	var foodId = $routeParams.id || 0;

	if (foodId) {
		fgApi.foods.get(foodId).then(success, failed);
	}

	function success(response) {
		self.food = response;
	}

	function failed() {
		$window.console.log("Failed to load food");
	}

	this.toggleAllergy = function toggleAllergy(allergyEvent) {
		var element = angular.element(allergyEvent.currentTarget);

		element.toggleClass("active");
		this.food.allergen = this.food.allergen ^ parseInt(element.attr("value"), 10);
	};

	this.toggleDiet = function toggleAllergy(dietEvent) {
		var element = angular.element(dietEvent.currentTarget);

		element.toggleClass("active");
		this.food.diet = this.food.diet ^ parseInt(element.attr("value"), 10);
	};

	this.contains = function contains(allergen) {
		return !!(this.food.allergen & allergen);
	};

	this.diet = function diet(diet) {
		return !!(this.food.diet & diet);
	};

	this.save = function save() {
		if(this.food.id) {
			fgApi.foods.update(this.food).then(function updated() {
				$location.url("/information/" + self.food.id);
			});
		} else {
			fgApi.foods.create(this.food).then(function created(food) {
				$location.url("/information/" + food.id);
			});
		}
	};

	this.cancel = function cancel() {
		$window.history.back();
	}
});

angular.
module("foodgics.food").
controller("InformationController", function InformationController(
	$location,
	$routeParams,
    fgApi,
	fgSession
) {
	"use strict";

	var self = this;

	this.$location = $location;
	this.fgSession = fgSession;

	this.food = null;

	var foodId = $routeParams.id || 0;

	this.report = function report() {
		fgApi.foods.report(this.food);
	};

	fgApi.foods.get(foodId).then(success, failed);

	function success(response) {
		self.food = response;
	}

	function failed() {
		$window.console.log("Failed to load food");
	}
});

angular.
module("foodgics.home").
controller("HomeController", function HomeController(
	$location,
    fgSession
) {
	"use strict";

	this.$location = $location;
	this.fgSession = fgSession;
});

angular.
module("foodgics.login").
controller("LoginController", function LoginController(
	$location,
	fgFacebook,
	fgApi
) {
	"use strict";

	this.loginFacebook = function loginFacebook() {
		fgFacebook.login().then(function loginSuccess() {
			fgApi.users.register().then(function (response) {
				if (response.error) {
					fgSession.logout();
				}
			});

			$location.url("/profile");
		}, function loginFailed() {
			console.log("login failed");
		});
	}
});

angular.
module("foodgics.navigation").
factory("fgActiveMenuItem", function activeMenuItemService() {
	"use strict";

	var activeItem;

	function setItem(item) {
		activeItem = item;
	}

	function getItem() {
		return activeItem;
	}

	return {
		setItem: setItem,
		getItem: getItem,
	};
});

angular.
module("foodgics.navigation").
component("footerComponent", {
	controller: "NavigationController",
	controllerAs: "vm",
	templateUrl: "html/navigation/footer-component.html",
});

angular.
module("foodgics.navigation").
component("navigationComponent", {
	controller: "NavigationController",
	controllerAs: "vm",
	templateUrl: "html/navigation/navigation-component.html",
});

angular.
module("foodgics.navigation").
controller("NavigationController", function NavigationController(
	$location,
	fgActiveMenuItem,
	fgSession
) {
	"use strict";

	this.$location = $location;
	this.fgActiveMenuItem = fgActiveMenuItem;
	this.fgSession = fgSession;
});

angular.
module("foodgics.profile").
controller("ProfileController", function ProfileController() {
	"use strict";


});

angular.
module("foodgics.search").
component("itemComponent", {
	controller: "ItemController",
	controllerAs: "vm",
	templateUrl: "html/search/item-component.html",
    bindings: {
        item: '<',
    },
});

angular.
module("foodgics.search").
controller("ItemController", function ItemController(
	$location
) {
	"use strict";

	this.$location = $location;
});

angular.
module("foodgics.search").
controller("SearchController", function SearchController(
    $timeout,
	$window,
    fgApi
) {
	"use strict";

		var self = this;

		this.searchString = "";
        this.foods = [];

		var searchTimeout;
		var allergen = 0;
		var diet = 0;

		this.filter = function filter(allergenFilter, dietFilter) {
			allergen = allergenFilter;
			diet = dietFilter;

			fgApi.foods.list(self.searchString, allergen, diet).then(success, failed);
		};

        this.search = function search() {

	        if (searchTimeout) {
	        	$timeout.cancel(searchTimeout);
	        }

        	searchTimeout = $timeout(function timeoutCallback() {
		        fgApi.foods.list(self.searchString, allergen, diet).then(success, failed);
	        }, 500);
        };

        fgApi.foods.list().then(success, failed);

        function success(response) {
            self.foods = response;
        }

        function failed() {
            $window.console.log("getting foods failed");
        }
});

angular.
module("foodgics.session").
factory("fgFacebook", function facebookService(
	$rootScope,
    $q,
	$timeout,
    fgSession
) {
	function getLoginStatus() {
		var loginDeferred = $q.defer();

		FB.getLoginStatus(function fbGetLoginStatus(response) {
			$timeout(function timeoutCallback() {
				handleResponse(response, loginDeferred);
			});
		});

		return loginDeferred.promise;
	}

	function login() {
		var loginDeferred = $q.defer();

		FB.login(function fbLogin(response) {
			$timeout(function timeoutCallback() {
				handleResponse(response, loginDeferred);
			});
		}, {scope: 'email'});

		return loginDeferred.promise;
	}

	function handleResponse(response, loginDeferred) {
		console.log(response);

		if (response.status === "connected") {
			fgSession.setAuthResponse(response.authResponse);
			loginDeferred.resolve();
		} else {
			loginDeferred.reject();
		}
	}

	return {
		login: login,
		getLoginStatus: getLoginStatus,
	};
});

angular.
module("foodgics.session").
factory("fgSession", function sessionService() {

	var authResponse = null;
    var loggedIn = false;

	function isLoggedIn() {
	    return loggedIn;
    }

	function getAuthResponse() {
	    return authResponse;
    }

    function setAuthResponse(ar) {
	    loggedIn = true;
	    authResponse = ar;
    }

    function logout() {
		loggedIn = false;
		authResponse = null;
	}

	return {
		isLoggedIn: isLoggedIn,
		getAuthResponse: getAuthResponse,
		setAuthResponse: setAuthResponse,
		logout: logout,
    };
});

angular.
module("foodgics.utils").
factory("fgQueryString", function queryStringService() {
	"use strict";

	function generate(obj) {
		var parts = [];
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
			}
		}
		return parts.join("&");
	}

	return {
		generate: generate,
	};
});

angular.
module("foodgics.api.foods").
factory("fgFoods", function foodsService(
    $http,
    fgQueryString,
	fgSession
) {
    "use strict";

    function list(searchString, allergenFilter, dietFilter) {
    	var url = "/api/foods";

    	var queryStringObj = {};

    	if (searchString) {
		    queryStringObj.search = searchString;
	    }

	    if (allergenFilter) {
    		queryStringObj.allergenFilter = allergenFilter;
	    }

	    if (dietFilter) {
			queryStringObj.dietFilter = dietFilter;
		}

		var queryString = fgQueryString.generate(queryStringObj);
		if (queryString) {
			url += "?" + queryString;
		}

	    return $http.get(url).then(handler, handler);

        function handler(response) {
            return response.data;
        }
    }

    function get(id) {
	    return $http.get("/api/foods/" + id).then(handler, handler);

	    function handler(response) {
		    return response.data;
	    }
    }

    function create(food) {
    	food.accessToken = fgSession.getAuthResponse().accessToken;
		return $http.post("/api/foods", food).then(handler, handler);

		function handler(response) {
			return response.data;
		}
    }

    function update(food) {
		food.accessToken = fgSession.getAuthResponse().accessToken;
    	return $http.put("/api/foods", food).then(handler, handler);

    	function handler(response) {
    		return response.data;
	    }
    }

    function report(food) {
		var accessToken = fgSession.getAuthResponse().accessToken;
		return $http.post("/api/foods/" + food.id + "/report", {accessToken: accessToken}).then(handler, handler);

		function handler(response) {
			return response.data;
		}
	}

    return {
        list: list,
        get: get,
	    create: create,
	    update: update,
		report: report,
    };
});

angular.
module("foodgics.api.users").
factory("fgUsers", function foodsService(
	$http,
	fgSession
) {
	"use strict";

	function register() {
		food.accessToken = fgSession.getAuthResponse().accessToken;
		return $http.post("/api/users").then(handler, handler);

		function handler(response) {
			return response.data;
		}
	}

	return {
		register: register
	};
});

(function iife() {
    window.fbAsyncInit = function () {
		var facebookSettings = {
			cookie: true,
			xfbml: true,
			version: 'v2.8'
		};

		// dev: 267803737018506
		// live: 1510643125642114
		facebookSettings.appId = location.hostname === "localhost" ? '267803737018506' : '1510643125642114';

        FB.init(facebookSettings);
        FB.AppEvents.logPageView();

        // Wrapping bootstrap because getLoginStatus will be cached.
	    // When loading the facebook login status in the angular app will be instant.
	    // Avoiding late login.
	    FB.getLoginStatus(function getLoginStatus() {
		    angular.element(function () {
			    angular.bootstrap(document, ["foodgics"]);
		    });
	    });
    };

    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.9&appId=1510643125642114";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
}());
