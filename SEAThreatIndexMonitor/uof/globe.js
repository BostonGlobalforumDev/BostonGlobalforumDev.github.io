/*global sharedObject, d3*/

(function() {
    "use strict";
    var yearPerSec = 86400*365;
    var gregorianDate = new Cesium.GregorianDate();
    var cartesian3Scratch = new Cesium.Cartesian3();


    // ThreatIndex : Military expenditure
    var ThreatIndexDataSource = function() {
        // private declarations
        this._name = "Threat index";
        this._entityCollection = new Cesium.EntityCollection();
        this._clock = new Cesium.DataSourceClock();
//        this._clock.startTime = Cesium.JulianDate.fromIso8601("1990-01-02");
        this._clock.startTime = Cesium.JulianDate.fromIso8601("1974-01-02");
//        this._clock.stopTime = Cesium.JulianDate.fromIso8601("2013-01-02");
        this._clock.stopTime = Cesium.JulianDate.fromIso8601("2016-01-02");
//        this._clock.currentTime = Cesium.JulianDate.fromIso8601("1990-01-02");
        this._clock.currentTime = Cesium.JulianDate.fromIso8601("2015-04-20");
        this._clock.clockRange = Cesium.ClockRange.LOOP_STOP;
        this._clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
        this._clock.multiplier = yearPerSec * 5;
        this._changed = new Cesium.Event();
        this._error = new Cesium.Event();
        this._isLoading = false;
        this._loading = new Cesium.Event();
        this._year = 1990;
        this._wealthScale = d3.scale.log().domain([300, 1e5]).range([0, 10000000.0]);
        this._healthScale = d3.scale.linear().domain([10, 85]).range([0, 10000000.0]);
//        this._militaryScale = d3.scale.linear().domain([0, 100]).range([0.0, 1000000000.0]);
        this._militaryScale = d3.scale.linear().domain([0, 1000]).range([0.0, 1000000000.0]);
        this._populationScale = d3.scale.sqrt().domain([0, 5e8]).range([5.0, 30.0]);
        this._colorScale = d3.scale.category20c();
        this._selectedEntity = undefined;
    };

    Object.defineProperties(ThreatIndexDataSource.prototype, {
        name : {
            get : function() {
                return this._name;
            }
        },
        clock : {
            get : function() {
                return this._clock;
            }
        },
        entities : {
            get : function() {
                return this._entityCollection;
            }
        },
        selectedEntity : {
            get : function() {
                return this._selectedEntity;
            },
            set : function(e) {
                if (Cesium.defined(this._selectedEntity)) {
                    var entity = this._selectedEntity;
                    entity.polyline.material.color = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString(this._colorScale(entity.region)));
                }
                if (Cesium.defined(e)) {
                    e.polyline.material.color = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString('#00ff00'));
                }
                this._selectedEntity = e;
            }
        },
        /**
         * Gets a value indicating if the data source is currently loading data.
         * @memberof ThreatIndexDataSource.prototype
         * @type {Boolean}
         */
        isLoading : {
            get : function() {
                return this._isLoading;
            }
        },
        /**
         * Gets an event that will be raised when the underlying data changes.
         * @memberof ThreatIndexDataSource.prototype
         * @type {Event}
         */
        changedEvent : {
            get : function() {
                return this._changed;
            }
        },
        /**
         * Gets an event that will be raised if an error is encountered during
         * processing.
         * @memberof ThreatIndexDataSource.prototype
         * @type {Event}
         */
        errorEvent : {
            get : function() {
                return this._error;
            }
        },
        /**
         * Gets an event that will be raised when the data source either starts or
         * stops loading.
         * @memberof ThreatIndexDataSource.prototype
         * @type {Event}
         */
        loadingEvent : {
            get : function() {
                return this._loading;
            }
        }
    });

    ThreatIndexDataSource.prototype.loadUrl = function(url) {
        if (!Cesium.defined(url)) {
            throw new Cesium.DeveloperError("url must be defined.");
        }

        var that = this;
        return Cesium.when(Cesium.loadJson(url), function(json) {
            return that.load(json);
        }).otherwise(function(error) {
            this._setLoading(false);
            that._error.raiseEvent(that, error);
            return Cesium.when.reject(error);
        });
    };

    ThreatIndexDataSource.prototype.load = function(data) {
        if (!Cesium.defined(data)) {
            throw new Cesium.DeveloperError("data must be defined.");
        }
        
        
        var vietnam = {
            long: 108.4265113,
            lat: 13.2904027
        };
        
        var china = {
            long: 110.999927,
            lat: 30.000074
        };
        
        var event1 = {
            date: '14 March 1988',
            position: {
                long: 114.287,
                lat: 9.715
            },
            description: "China forced Vietnam out in a skirmish in which 64 unarmed Vietnamese navy engineers were killed.",
            media: '<iframe width="420" height="315" src="https://www.youtube.com/embed/uq30CY9nWE8" frameborder="0" allowfullscreen></iframe>'
        }


        
        var ellipsoid = viewer.scene.globe.ellipsoid;

        this._setLoading(true);
        var entities = this._entityCollection;
        //It's a good idea to suspend events when making changes to a 
        //large amount of entities.  This will cause events to be batched up
        //into the minimal amount of function calls and all take place at the
        //end of processing (when resumeEvents is called).
        entities.suspendEvents();
        entities.removeAll();

        var color = new Cesium.Color(251 / 255, 176 / 255, 64 / 255, 0.5);
        // Event 1
        entities.add({
            position : Cesium.Cartesian3.fromDegrees(114.287,9.715),
            type: 'event',
            data: event1,
            point : {
                color: Cesium.Color.RED,
                pixelSize: 3,
                outlineColor: Cesium.Color.RED.withAlpha(0.5),                
                outlineWidth : 2,
                show: true                
            }
//            ellipse : {
////                semiMinorAxis : 100000.0,
////                semiMajorAxis : 100000.0,
//                semiMinorAxis : 10000.0,
//                semiMajorAxis : 10000.0,
//                height : 0.0,
//                material : Cesium.Color.RED.withAlpha(0.5)
////                material : Cesium.Color.fromRandom({alpha : 0.5})
//            }
        });


        
        
        var nation1 = new Cesium.Entity();
        
        nation1.bezier = new Cesium.ConstantProperty(true);
        nation1.type = 'actor';
        nation1.polyline = {
                            positions: addBezier(event1.position, vietnam, 500000),
                            show: true,
                            width: 1,
                            material: new Cesium.PolylineGlowMaterialProperty({
                                            glowPower: 0.3,
                                            color: color
                            })
                          };
        entities.add(nation1);
         
        var nation2 = new Cesium.Entity();
        
        nation2.bezier = new Cesium.ConstantProperty(true);
        nation2.type = 'actor';
        nation2.polyline = {
                            positions: addBezier(event1.position, china, 1000000),
                            show: true,
                            width: 1,
                            material: new Cesium.PolylineGlowMaterialProperty({
                                            glowPower: 0.3,
                                            color: color
                            })
                          };
         entities.add(nation2);
         
         // End of Event 1

        // Event 2
//        var event2 = {
//            date: '01/1974',
//            position: {
//                long: 114.287,
//                lat: 9.715
//            },
//            description: "19-20 January 1974: A Chinas PLA-N fleet made up of four Hainan class fast attack craft, two mine sweepers and two fishing boats defeated a South Vietnamese force of three destroyers and a corvette, and then seized 3 islands in the Crescent Group previously occupied by Vietnamese forces. Hainan class fast attack craft have a displacement of 375 tons and a crew of 69. They are armed with two twin 57 mm, guns and two twin 25 mm, machine guns. The PLA-N mine sweepers had a 520 ton displacement with a crew of 70. They were armed with two twin 37 mm guns, two twin 25 mm and two twin 14.5 mm machine guns. 4 The battle for Duncan Island deployed several torpedo boats, two armed trawlers, and one marine landing craft, and was supported by MiG aircraft based on Hainan Island",
//            media: '<iframe width="420" height="315" src="https://www.youtube.com/embed/uq30CY9nWE8" frameborder="0" allowfullscreen></iframe>'
//        }
//
//        entities.add({
//            position : Cesium.Cartesian3.fromDegrees(event2.position.long,event2.position.lat),
//            type: 'event',
//            data: event2,
//            point : {
//                color: Cesium.Color.RED,
//                pixelSize: 3,
//                outlineColor: Cesium.Color.RED.withAlpha(0.5),                
//                outlineWidth : 2,
//                show: true                
//            }
//            ellipse : {
////                semiMinorAxis : 100000.0,
////                semiMajorAxis : 100000.0,
//                semiMinorAxis : 10000.0,
//                semiMajorAxis : 10000.0,
//                height : 0.0,
//                material : Cesium.Color.RED.withAlpha(0.5)
////                material : Cesium.Color.fromRandom({alpha : 0.5})
//            }
//        });


        
        
//        var nation3 = new Cesium.Entity();
//        
//        nation3.bezier = new Cesium.ConstantProperty(true);
//        nation3.type = 'actor';
//        nation3.polyline = {
//                            positions: addBezier(event2.position, vietnam, 500000),
//                            show: true,
//                            width: 1,
//                            material: new Cesium.PolylineGlowMaterialProperty({
//                                            glowPower: 0.3,
//                                            color: color
//                            })
//                          };
//        entities.add(nation3);
//         
//        var nation4 = new Cesium.Entity();
//        
//        nation4.bezier = new Cesium.ConstantProperty(true);
//        nation4.type = 'actor';
//        nation4.polyline = {
//                            positions: addBezier(event1.position, china, 1000000),
//                            show: true,
//                            width: 1,
//                            material: new Cesium.PolylineGlowMaterialProperty({
//                                            glowPower: 0.3,
//                                            color: color
//                            })
//                          };
//         entities.add(nation4);
        
        
        
        
        // for each nation defined in nations_geo.json, create a polyline at that lat, lon
//        for (var i = 0; i < data.length; i++){
//            var nation = data[i];
//            var surfacePosition = Cesium.Cartesian3.fromDegrees(nation.lon, nation.lat, 0.0);
//
//            // Construct Wealth related Properties
//            var wealth = new Cesium.SampledPositionProperty();
//            var sampledWealth = new Cesium.SampledProperty(Number);
//            var heightPosition = Cesium.Cartesian3.fromDegrees(nation.lon, nation.lat, this._wealthScale(nation.income[0][1]), ellipsoid, cartesian3Scratch);
//            wealth.addSample(Cesium.JulianDate.fromIso8601("1799"), heightPosition);
//            sampledWealth.addSample(Cesium.JulianDate.fromIso8601("1799"), nation.income[0][1]);
//            for (var j = 0; j < nation.income.length; j++) {
//                var year = nation.income[j][0];
//                var income = nation.income[j][1];
//                heightPosition = Cesium.Cartesian3.fromDegrees(nation.lon, nation.lat, this._wealthScale(income), ellipsoid, cartesian3Scratch);
//                wealth.addSample(Cesium.JulianDate.fromIso8601(year.toString()), heightPosition);
//                sampledWealth.addSample(Cesium.JulianDate.fromIso8601(year.toString()), income);
//            }
//            wealth.addSample(Cesium.JulianDate.fromIso8601("2010"), surfacePosition);
//            sampledWealth.addSample(Cesium.JulianDate.fromIso8601("2010"), 0.0);
//
//            // Construct Health related Properties
//            var health = new Cesium.SampledPositionProperty();
//            var sampledHealth = new Cesium.SampledProperty(Number);
//            heightPosition = Cesium.Cartesian3.fromDegrees(nation.lon, nation.lat, this._healthScale(nation.lifeExpectancy[0][1]), ellipsoid, cartesian3Scratch);
//            health.addSample(Cesium.JulianDate.fromIso8601("1799"), heightPosition);
//            sampledHealth.addSample(Cesium.JulianDate.fromIso8601("1799"), nation.lifeExpectancy[0][1]);
//            for (var j = 0; j < nation.lifeExpectancy.length; j++) {
//                var year = nation.lifeExpectancy[j][0];
//                var lifeExpectancy = nation.lifeExpectancy[j][1];
//                heightPosition = Cesium.Cartesian3.fromDegrees(nation.lon, nation.lat, this._healthScale(lifeExpectancy), ellipsoid, cartesian3Scratch);
//                health.addSample(Cesium.JulianDate.fromIso8601(year.toString()), heightPosition);
//                sampledHealth.addSample(Cesium.JulianDate.fromIso8601(year.toString()), lifeExpectancy);
//            }
//            health.addSample(Cesium.JulianDate.fromIso8601("2010"), surfacePosition);
//            sampledHealth.addSample(Cesium.JulianDate.fromIso8601("2010"), 0.0);
//
//           // Construct MilitaryExpenditure related Properties
//            var military = new Cesium.SampledPositionProperty();
//            var sampledMilitary = new Cesium.SampledProperty(Number);
//            heightPosition = Cesium.Cartesian3.fromDegrees(nation.lon, nation.lat, this._militaryScale(nation.militaryexpenditure[0][1]), ellipsoid, cartesian3Scratch);
//            military.addSample(Cesium.JulianDate.fromIso8601("1990"), heightPosition);
//            sampledMilitary.addSample(Cesium.JulianDate.fromIso8601("1990"), nation.militaryexpenditure[0][1]);
//            for (var j = 0; j < nation.militaryexpenditure.length; j++) {
//                var year = nation.militaryexpenditure[j][0];
//                var militaryExpd = nation.militaryexpenditure[j][1];
//                heightPosition = Cesium.Cartesian3.fromDegrees(nation.lon, nation.lat, this._militaryScale(militaryExpd), ellipsoid, cartesian3Scratch);
//                military.addSample(Cesium.JulianDate.fromIso8601(year.toString()), heightPosition);
//                sampledMilitary.addSample(Cesium.JulianDate.fromIso8601(year.toString()), militaryExpd);
//            }
//            military.addSample(Cesium.JulianDate.fromIso8601("2015"), surfacePosition);
//            sampledMilitary.addSample(Cesium.JulianDate.fromIso8601("2015"), 0.0);
//
//            // Construct Population related Properties
//            var populationWidth = new Cesium.SampledProperty(Number);
//            var sampledPopulation = new Cesium.SampledProperty(Number);
//            populationWidth.addSample(Cesium.JulianDate.fromIso8601("1799"), this._populationScale(nation.population[0][1]));
//            sampledPopulation.addSample(Cesium.JulianDate.fromIso8601("1799"), nation.population[0][1]);
//            var population = 0.0;
//            for (var j = 0; j < nation.population.length; j++) {
//                var year = nation.population[j][0];
//                population = nation.population[j][1];
//                populationWidth.addSample(Cesium.JulianDate.fromIso8601(year.toString()), this._populationScale(population));
//                sampledPopulation.addSample(Cesium.JulianDate.fromIso8601(year.toString()), population);
//            }
//            populationWidth.addSample(Cesium.JulianDate.fromIso8601("2010"), this._populationScale(population));
//            sampledPopulation.addSample(Cesium.JulianDate.fromIso8601("2010"), population);
//
//            var polyline = new Cesium.PolylineGraphics();
//            polyline.show = new Cesium.ConstantProperty(true);
//            var outlineMaterial = new Cesium.PolylineOutlineMaterialProperty();
//            outlineMaterial.color = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString(this._colorScale(nation.region)));
//            outlineMaterial.outlineColor = new Cesium.ConstantProperty(new Cesium.Color(0.0, 0.0, 0.0, 1.0));
//            outlineMaterial.outlineWidth = new Cesium.ConstantProperty(3.0);
//            polyline.material = outlineMaterial;
//            polyline.width = populationWidth;
//            polyline.followSurface = new Cesium.ConstantProperty(false);
//
//            var entity = new Cesium.Entity(nation.name);
//            entity.polyline = polyline;
//            polyline.positions = new Cesium.PositionPropertyArray([new Cesium.ConstantPositionProperty(surfacePosition), military]);
//
//            // Add data properties to entity
//            entity.addProperty('region');
//            entity.region = nation.region;
//            entity.addProperty('wealth');
//            entity.wealth = wealth;
//            entity.addProperty('health');
//            entity.health = health;
//            entity.addProperty('surfacePosition');
//            entity.surfacePosition = surfacePosition;
//            entity.addProperty('nationData');
//            entity.nationData = nation;
//            entity.addProperty('lifeExpectancy');
//            entity.lifeExpectancy = sampledHealth;
//            entity.addProperty('income');
//            entity.income = sampledWealth;
//            entity.addProperty('population');
//            entity.population = sampledPopulation;
//            entity.addProperty('military');
//            entity.military = sampledMilitary;
//            //entity.description = new Cesium.ConstantProperty("foo");
//
//            // if we wanted to use points instead ...
//            //entity.position = wealth;
//            //entity.point = new Cesium.PointGraphics();
//            //entity.point.pixelSize = new Cesium.ConstantProperty(5);
//
//            //Add the entity to the collection.
//            entities.add(entity);
//        }

        //Once all data is processed, call resumeEvents and raise the changed event.
        entities.resumeEvents();
        this._changed.raiseEvent(this);
        this._setLoading(false);
        
    };

    ThreatIndexDataSource.prototype._setLoading = function(isLoading) {
        if (this._isLoading !== isLoading) {
            this._isLoading = isLoading;
            this._loading.raiseEvent(this, isLoading);
        }
    };

    ThreatIndexDataSource.prototype._setInfoDialog = function(time) {
        if (Cesium.defined(this._selectedEntity)) {
            var militaryExpenditure = this._selectedEntity.military.getValue(time);
            var lifeExpectancy = this._selectedEntity.lifeExpectancy.getValue(time);
            var income = this._selectedEntity.income.getValue(time);
            var population = this._selectedEntity.population.getValue(time);
            $("#info table").remove();
            $("#info").append("<table><tr><td>Military Expenditure:</td><td>" +(parseFloat(militaryExpenditure)*1000)+" milions US$</td></tr>\
            <tr><td>Life Expectancy:</td><td>" +parseFloat(lifeExpectancy).toFixed(1)+"</td></tr>\
            <tr><td>Income:</td><td>" +parseFloat(income).toFixed(1)+"</td></tr>\
            <tr><td>Population:</td><td>" +parseFloat(population).toFixed(1)+"</td></tr>\
            </table>\
            ");
            $("#info table").css("font-size", "10px");
            $("#info").dialog({
                title : this._selectedEntity.id,
                width: 200,
                height: 150,
                modal: false,
                position: {my: "right center", at: "right center", of: "canvas"},
                show: "slow",
                beforeClose: function(event, ui) {
                    $("#info").data("dataSource").selectedEntity = undefined;
                }
            });
            $("#info").data("dataSource", this);
        }
    };

    ThreatIndexDataSource.prototype.update = function(time) {
        Cesium.JulianDate.toGregorianDate(time, gregorianDate);
        var currentYear = gregorianDate.year + gregorianDate.month / 12;
        if (currentYear !== this._year && typeof window.displayYear !== 'undefined'){
            window.displayYear(currentYear);
            this._year = currentYear;

            this._setInfoDialog(time);
        }

        return true;
    };

    $("#radio").buttonset();
    $("#radio").css("font-size", "12px");
    $("#radio").css("font-size", "12px");
    $("body").css("background-color", "black");

//    $("input[name='healthwealth']").change(function(d){
//        var entities = healthAndWealth.entities.entities;
//        healthAndWealth.entities.suspendEvents();
//        for (var i = 0; i < entities.length; i++) {
//            var entity = entities[i];
//            if (d.target.id === 'health') {
//                entity.polyline.positions = new Cesium.PositionPropertyArray([new Cesium.ConstantPositionProperty(entity.surfacePosition), entity.health]);
//            } else {
//                entity.polyline.positions = new Cesium.PositionPropertyArray([new Cesium.ConstantPositionProperty(entity.surfacePosition), entity.wealth]);
//            }
//        }
//        healthAndWealth.entities.resumeEvents();
//    });

    $("input[name='military']").change(function(d){
//        console.log("clicked");
        var entities = theartIndex.entities.entities;
        theartIndex.entities.suspendEvents();
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            if (d.target.id === 'thindex') {
                //entity.polyline.positions = new Cesium.PositionPropertyArray([new Cesium.ConstantPositionProperty(entity.surfacePosition), entity.military]);
                window.location = "./../";
                
            } else {
                //entity.polyline.positions = new Cesium.PositionPropertyArray([new Cesium.ConstantPositionProperty(entity.surfacePosition), entity.wealth]);
                
//                console.log("use of force radio button");
//                var camera = viewer.scene.camera;
//
//                camera.setView({
//                    position : Cesium.Cartesian3.fromDegrees(-75.5847, 40.0397, 1000.0),
//                    heading : -Cesium.Math.PI_OVER_TWO,
//                    pitch : -Cesium.Math.PI_OVER_FOUR,
//                    roll : 0.0
//                });
//                console.log(camera);
//
//                var layers = viewer.imageryLayers;
//                var blackMarble = layers.addImageryProvider(new Cesium.TileMapServiceImageryProvider({
//                    url : '//cesiumjs.org/blackmarble',
//                    maximumLevel : 8,
//                    credit : 'Black Marble imagery courtesy NASA Earth Observatory'
//                }));
//                blackMarble.alpha = 0.5;
//                blackMarble.brightness = 2.0;

//                layers.addImageryProvider(new Cesium.SingleTileImageryProvider({
//                    url : '../images/Cesium_Logo_overlay.png',
//                    rectangle : Cesium.Rectangle.fromDegrees(-75.0, 28.0, -67.0, 29.75)
//                }));

//                var _ellipsoid = viewer.scene.globe.ellipsoid;
//
//                var _destination = Cesium.Cartographic.fromDegrees(114.287,9.715, 10000000.0);
//                var _destCartesian = _ellipsoid.cartographicToCartesian(_destination);
//                _destination = _ellipsoid.cartesianToCartographic(_destCartesian);
//                
////                viewer.scene.camera.flyTo({
////                        destination: _destination
////                    });
//                if (!_ellipsoid
//                   .cartographicToCartesian(_destination)
//                   .equalsEpsilon(viewer.scene.camera.positionWC, Cesium.Math.EPSILON6)) {
//                   console.log(_destCartesian);
//                    viewer.scene.camera.flyTo({
//                        destination: _destCartesian
//                    });
//                }
            }
        }
        theartIndex.entities.resumeEvents();
    });
    var viewer = new Cesium.Viewer('cesiumContainer', 
            {
                fullscreenElement : document.body,
                infoBox : false,
                timeline: false
            });

//    var stamenTonerImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[8];
    var bingsArielImagery = viewer.baseLayerPicker.viewModel.imageryProviderViewModels[1];
    viewer.baseLayerPicker.viewModel.selectedImagery = bingsArielImagery;

    // setup clockview model
    viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP;
    viewer.clock.startTime = Cesium.JulianDate.fromIso8601("1800-01-02");
    viewer.clock.currentTime = Cesium.JulianDate.fromIso8601("1800-01-02");
    viewer.clock.stopTime = Cesium.JulianDate.fromIso8601("2014-01-02");
    viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK_MULTIPLIER;
    viewer.clock.multiplier = yearPerSec * 5;

    viewer.animation.viewModel.setShuttleRingTicks([yearPerSec, yearPerSec*5, yearPerSec*10, yearPerSec*50]);

    viewer.animation.viewModel.dateFormatter = function(date, viewModel) {
        Cesium.JulianDate.toGregorianDate(date, gregorianDate);
        return 'Year: ' + gregorianDate.year;
    };
    viewer.animation.viewModel.timeFormatter = function(date, viewModel) {
        return '';
    };
    viewer.scene.skyBox.show = false;
    viewer.scene.sun.show = false;
    viewer.scene.moon.show = false;
    viewer.clock.shouldAnimate = false;

    viewer.scene.morphToColumbusView(5.0);
//    viewer.scene.camera.flyTo({
//        destination : Cesium.Cartesian3.fromDegrees(114.287, 9.715+10.0, 10000000.0-4.0)
//    });
    

    var theartIndex = new ThreatIndexDataSource();
    theartIndex.loadUrl('nations_geo.json');
    viewer.dataSources.add(theartIndex);




    // If the mouse is over the billboard, change its scale and color
    var highlightBarHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    highlightBarHandler.setInputAction(
        function (movement) {
            var pickedObject = viewer.scene.pick(movement.endPosition);
            if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id)) {
                if (Cesium.defined(pickedObject.id.nationData)) {
                    sharedObject.dispatch.nationMouseover(pickedObject.id.nationData, pickedObject);
//                    healthAndWealth.selectedEntity = pickedObject.id;
                    theartIndex.selectedEntity = pickedObject.id;
                }
            }
        },
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
    );

    var flyToHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    flyToHandler.setInputAction(
        function (movement) {
            var pickedObject = viewer.scene.pick(movement.position);
            console.log(pickedObject);
            if (!flyOnStart){
//                console.log("flyOnStart");
                sharedObject.flyToDedaultPos();
                flyOnStart=true;
            }

            if (Cesium.defined(pickedObject) && Cesium.defined(pickedObject.id) && (Cesium.defined(pickedObject.id.type) && pickedObject.id.type=='event')) {
//                console.log("HIER FLY TO");
//                console.log(pickedObject.id);
                sharedObject.flyTo(pickedObject.id);
            }
        },
        Cesium.ScreenSpaceEventType.LEFT_CLICK
    );

    // Response to a nation's mouseover event
    sharedObject.dispatch.on("nationMouseover.cesium", function(nationObject) {
//        console.log(nationObject);
        $("#info table").remove();
        $("#info").append("<table> \
        <tr><td>Military Expenditure:</td><td>" +(parseFloat(nationObject.militaryExpenditure)*1000)+" milions US$</td></tr>\
        <tr><td>Life Expectancy:</td><td>" +parseFloat(nationObject.lifeExpectancy).toFixed(1)+"</td></tr>\
        <tr><td>Income:</td><td>" +parseFloat(nationObject.income).toFixed(1)+"</td></tr>\
        <tr><td>Population:</td><td>" +parseFloat(nationObject.population).toFixed(1)+"</td></tr>\
        </table>\
        ");
        $("#info table").css("font-size", "10px");
        $("#info").dialog({
            title : nationObject.name,
            width: 200,
            height: 150,
            modal: false,
            position: {my: "right center", at: "right center", of: "canvas"},
            show: "slow"
        });
      });
    var showEventDialog = function(eventObject) {
//        console.log(nationObject);
        $("#eventinfo").html('');
        $("#eventinfo table").remove();
        $("#eventinfo").append("<table><tr><td>Date:</td><td>" +eventObject.date+"</td></tr><tr><td>Description:</td><td>" +eventObject.description+"</td></tr><tr><td>Media:</td><td>" +eventObject.media+"</td></tr></table>");
        $("#eventinfo table").css("font-size", "10px");
        $("#eventinfo").dialog({
            title : 'Event',
            width: 600,
            height: 400,
            modal: false,
            position: {my: "right center", at: "right center", of: "canvas"},
            show: "slow",
            beforeClose: function(event, ui) {
                $("#eventinfo").html('');
            }
        });
      };

//    var ellipsoid = viewer.scene.globe.ellipsoid;
//    var flags = {
//        looking : false,
//        moveForward : false,
//        moveBackward : false,
//        moveUp : false,
//        moveDown : false,
//        moveLeft : false,
//        moveRight : false
//    };
//    var startFlag=true;
//    viewer.clock.onTick.addEventListener(function(clock) {
//        var camera = viewer.camera;
//        // console.log(clock);
//        
//        if (startFlag){  
//            console.log(clock);
//            sharedObject.flyToDedaultPos();
//            
//        }
//
//        if (flags.looking) {
//            var width = canvas.clientWidth;
//            var height = canvas.clientHeight;
//
//            // Coordinate (0.0, 0.0) will be where the mouse was clicked.
//            var x = (mousePosition.x - startMousePosition.x) / width;
//            var y = -(mousePosition.y - startMousePosition.y) / height;
//
//            var lookFactor = 0.05;
//            camera.lookRight(x * lookFactor);
//            camera.lookUp(y * lookFactor);
//        }
////
//        // Change movement speed based on the distance of the camera to the surface of the ellipsoid.
//        var cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
//        var cameraLongitude = ellipsoid.cartesianToCartographic(camera.position).longitude;
////        console.log(camera.position);
////        console.log(ellipsoid.cartesianToCartographic(camera.position));
//        if (cameraHeight<3000000){ 
//            flags.moveForward= false;
//            flags.moveRight= true;
//        }
////        if (cameraLongitude<-0.4) flags.moveRight= false;
////        console.log(cameraHeight);
////        console.log(cameraLongitude);
////        var moveRate = cameraHeight / 100.0;
//        var moveRate = 10000.0 / 100.0;
//
//        if (flags.moveForward) {
//            camera.moveForward(moveRate);
//        }
//        if (flags.moveBackward) {
//            camera.moveBackward(moveRate);
//        }
//        if (flags.moveUp) {
//            camera.moveUp(moveRate);
//        }
//        if (flags.moveDown) {
//            camera.moveDown(moveRate);
//        }
//        if (flags.moveLeft) {
//            camera.moveLeft(moveRate);
//        }
//        if (flags.moveRight) {
//            camera.moveRight(moveRate);
//            camera.moveRight(10);
//        }
//    });

    // define functionality for flying to a nation
    // this callback is triggered when a nation is clicked
    sharedObject.flyTo = function(pickedObject) {
        
//        viewer.scene.morphTo3D(5.0);
//        var camera = viewer.scene.camera;
//
//        camera.setView({
//            position : Cesium.Cartesian3.fromDegrees(114.287, 9.715, 10000000.0),
//            heading : -Cesium.Math.PI_OVER_TWO,
//            pitch : -Cesium.Math.PI_OVER_FOUR,
//            roll : 0.0
//        });
//        console.log(viewer);
        var ellipsoid = viewer.scene.globe.ellipsoid;

//        pickedObject = {};
//        pickedObject.data.positionlon = 114.287;
//        pickedObject.lat = 9.715;
        var destination = Cesium.Cartographic.fromDegrees(pickedObject.data.position.long, pickedObject.data.position.lat, 10000000.0-10.0);
        var destCartesian = ellipsoid.cartographicToCartesian(destination);
        destination = ellipsoid.cartesianToCartographic(destCartesian);

        // only fly there if it is not the camera's current position
        if (!ellipsoid
                   .cartographicToCartesian(destination)
                   .equalsEpsilon(viewer.scene.camera.positionWC, Cesium.Math.EPSILON6)) {
    // console.log(destCartesian);
            viewer.scene.camera.flyTo({
                destination: destCartesian
//                ,
//                orientation : {
//                    heading : Cesium.Math.toRadians(20.0),
//                    pitch : Cesium.Math.toRadians(-35.0),
//                    roll : 0.0
//                }
            });
            showEventDialog(pickedObject.data);
        }
    };

   sharedObject.flyToDedaultPos = function() {
//        viewer.scene.morphTo3D(5.0);
//        var camera = viewer.scene.camera;
//
//        camera.setView({
//            position : Cesium.Cartesian3.fromDegrees(114.287, 9.715, 10000000.0),
//            heading : -Cesium.Math.PI_OVER_TWO,
//            pitch : -Cesium.Math.PI_OVER_FOUR,
//            roll : 0.0
//        });



        var ellipsoid = viewer.scene.globe.ellipsoid;

        var defaultPos = {};
        defaultPos.lon = 114.287;
        defaultPos.lat = 9.715;
        var destination = Cesium.Cartographic.fromDegrees(defaultPos.lon, defaultPos.lat + 5.0, 10000008.0);
        var destCartesian = ellipsoid.cartographicToCartesian(destination);
        destination = ellipsoid.cartesianToCartographic(destCartesian);

        // only fly there if it is not the camera's current position
        if (!ellipsoid
                   .cartographicToCartesian(destination)
                   .equalsEpsilon(viewer.scene.camera.positionWC, Cesium.Math.EPSILON6)) {
    // console.log(destCartesian);
            viewer.scene.camera.flyTo({
                destination: destCartesian,
//                orientation : {
//                    heading : Cesium.Math.toRadians(175.0),
//                    pitch : Cesium.Math.toRadians(-35.0),
//                    roll : 0.0
//                }
            });
        }
    };


    // Util functions
    function addBezier(pointA, pointB, height) {

        var earth = Cesium.Ellipsoid.WGS84;

        // start and end points on the surface of the earth 
        var startPoint = earth.cartographicToCartesian(Cesium.Cartographic.fromDegrees(pointA.long, pointA.lat, 0.0));
        var endPoint = earth.cartographicToCartesian(Cesium.Cartographic.fromDegrees(pointB.long, pointB.lat, 0.0));

        // determine the midpoint (point will be inside the earth) 
        var addCartesian = startPoint.clone();
        Cesium.Cartesian3.add(startPoint, endPoint, addCartesian);
        var midpointCartesian = addCartesian.clone();
        Cesium.Cartesian3.divideByScalar(addCartesian, 2, midpointCartesian);

        // move the midpoint to the surface of the earth 
        earth.scaleToGeodeticSurface(midpointCartesian);

        // add some altitude if you want (1000 km in this case) 
        var midpointCartographic = earth.cartesianToCartographic(midpointCartesian);
        midpointCartographic.height = height;
        midpointCartesian = earth.cartographicToCartesian(midpointCartographic);

        var spline = new Cesium.CatmullRomSpline({
            times: [0.0, 0.5, 1.0],
            points: [
                startPoint,
                midpointCartesian,
                endPoint
            ],
            //firstTangent:startPoint,
            //lastTangent:endPoint
        });
        var polylinePoints = [];
        for (var ii = 0; ii < 30; ++ii) {
            polylinePoints.push(spline.evaluate(ii / 30));
        }
        var description = '';
        return polylinePoints;
    }

    // light spot
            var lightSize = 250;
            var x = 200;
            var y = 200;
            var context = null;

            function drawLightGradient()
            {
              context.save();
              var radialGradient = context.createRadialGradient(x + lightSize / 2, y + lightSize / 2, 0,x + lightSize / 2, y + lightSize / 2, lightSize / 2);
              radialGradient.addColorStop(0, "rgba(255, 165, 0, 0.7)");
              radialGradient.addColorStop(1, "transparent");
              context.globalCompositeOperation = "screen";
              context.fillStyle = radialGradient;
              context.fillRect(x, y, lightSize, lightSize);
              context.restore();
            }
//            drawLightGradient();
//            document.onkeydown = function(evt) {
//                // if (!canvas) canvas = document.getElementById("lcanvas");
//                var canvas = viewer.canvas;
//                context = canvas.getContext("2d");
//                
//                evt = evt || window.event;
//                switch (evt.keyCode) {
//                  case 65: // a
//                    x -= 5;
//                    if (x < 0)
//                      x = 0;
//                    clearDirtyRect();
//                    break;
//                  case 68: // d
//                    x += 5;
//                    if (x + lightSize > canvas.width)
//                      x = canvas.width - lightSize;
//                    clearDirtyRect();
//                    break;
//                  case 87: // w
//                    y -= 5;
//                    if (y < 0)
//                      y = 0;
//                    clearDirtyRect();
//                    break;
//                  case 83: // s
//                    y += 5;
//                    if(y + lightSize > canvas.height)
//                      y = canvas.height - lightSize;
//                    clearDirtyRect();
//                    break;
//                }
//  
//                console.log(x, y);
//
//                drawLightGradient();
//
//            }

})();