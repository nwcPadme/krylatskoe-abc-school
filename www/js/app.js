angular.module("krylatskoe_abc_school", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","ngMap","krylatskoe_abc_school.controllers", "krylatskoe_abc_school.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Krylatskoe ABC School" ;
		$rootScope.appLogo = "data/images/background/transparent.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_dash_ = false ;
		$rootScope.hide_menu_uche_ = false ;
		$rootScope.hide_menu_sche_ = false ;
		$rootScope.hide_menu_noti_ = false ;
		$rootScope.hide_menu_prof_ = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "krylatskoe_abc_school",
				storeName : "krylatskoe_abc_school",
				description : "The offline datastore for Krylatskoe ABC School app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}

			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

			//required: cordova plugin add onesignal-cordova-plugin --save
			if(window.plugins && window.plugins.OneSignal){
				window.plugins.OneSignal.enableNotificationsWhenActive(true);
				var notificationOpenedCallback = function(jsonData){
					try {
						$timeout(function(){
							$window.location = "#/krylatskoe_abc_school/" + jsonData.notification.payload.additionalData.page ;
						},200);
					} catch(e){
						console.log("onesignal:" + e);
					}
				}
				window.plugins.OneSignal.startInit("392750be-9324-4bdd-b71b-fbca8c6f8ab3").handleNotificationOpened(notificationOpenedCallback).endInit();
			}


		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("krylatskoe_abc_school.dash_");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("ru");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("ru");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?school\-abc\.ru/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("krylatskoe_abc_school",{
		url: "/krylatskoe_abc_school",
			abstract: true,
			templateUrl: "templates/krylatskoe_abc_school-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("krylatskoe_abc_school.about_us", {
		url: "/about_us",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.dash_", {
		url: "/dash_",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-dash_.html",
						controller: "dash_Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.dashboard", {
		url: "/dashboard",
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.hist_", {
		url: "/hist_",
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-hist_.html",
						controller: "hist_Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.login", {
		url: "/login",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-login.html",
						controller: "loginCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.menu_one", {
		url: "/menu_one",
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-menu_one.html",
						controller: "menu_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.menu_two", {
		url: "/menu_two",
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-menu_two.html",
						controller: "menu_twoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.noti_", {
		url: "/noti_",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-noti_.html",
						controller: "noti_Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.pay", {
		url: "/pay",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-pay.html",
						controller: "payCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.paym_", {
		url: "/paym_",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-paym_.html",
						controller: "paym_Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.pos", {
		url: "/pos",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-pos.html",
						controller: "posCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.prof", {
		url: "/prof",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-prof.html",
						controller: "profCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.prof_", {
		url: "/prof_",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-prof_.html",
						controller: "prof_Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.raz", {
		url: "/raz",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-raz.html",
						controller: "razCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.sch", {
		url: "/sch",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-sch.html",
						controller: "schCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.sche_", {
		url: "/sche_",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-sche_.html",
						controller: "sche_Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.tari_", {
		url: "/tari_",
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-tari_.html",
						controller: "tari_Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.task_", {
		url: "/task_",
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-task_.html",
						controller: "task_Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("krylatskoe_abc_school.uche_", {
		url: "/uche_",
		cache:false,
		views: {
			"krylatskoe_abc_school-side_menus" : {
						templateUrl:"templates/krylatskoe_abc_school-uche_.html",
						controller: "uche_Ctrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})


// router by user


	$urlRouterProvider.otherwise("/krylatskoe_abc_school/dash_");
});
