(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('@angular/forms')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', '@angular/forms'], factory) :
	(factory((global['ngx-slick'] = global['ngx-slick'] || {}),global._angular_core,global._angular_common,global._angular_forms));
}(this, (function (exports,_angular_core,_angular_common,_angular_forms) { 'use strict';

/**
 * Slick component
 */
var SlickComponent = (function () {
    /**
     * Constructor
     * @param {?} el
     * @param {?} zone
     */
    function SlickComponent(el, zone) {
        this.el = el;
        this.zone = zone;
        this.afterChange = new _angular_core.EventEmitter();
        this.beforeChange = new _angular_core.EventEmitter();
        this.breakpoint = new _angular_core.EventEmitter();
        this.destroy = new _angular_core.EventEmitter();
        this.slides = [];
        this.initialized = false;
    }
    /**
     * On component destroy
     * @return {?}
     */
    SlickComponent.prototype.ngOnDestroy = function () {
        this.unslick();
    };
    /**
     * On component view init
     * @return {?}
     */
    SlickComponent.prototype.ngAfterViewInit = function () {
    };
    /**
     * init slick
     * @return {?}
     */
    SlickComponent.prototype.initSlick = function () {
        var _this = this;
        var /** @type {?} */ self = this;
        this.zone.runOutsideAngular(function () {
            _this.$instance = $(_this.el.nativeElement).slick(_this.config);
            _this.initialized = true;
            _this.$instance.on('afterChange', function (event, slick, currentSlide) {
                self.zone.run(function () {
                    self.afterChange.emit({ event: event, slick: slick, currentSlide: currentSlide });
                });
            });
            _this.$instance.on('beforeChange', function (event, slick, currentSlide, nextSlide) {
                self.zone.run(function () {
                    self.beforeChange.emit({ event: event, slick: slick, currentSlide: currentSlide, nextSlide: nextSlide });
                });
            });
            _this.$instance.on('breakpoint', function (event, slick, breakpoint) {
                self.zone.run(function () {
                    self.breakpoint.emit({ event: event, slick: slick, breakpoint: breakpoint });
                });
            });
            _this.$instance.on('destroy', function (event, slick) {
                self.zone.run(function () {
                    self.destroy.emit({ event: event, slick: slick });
                });
            });
        });
    };
    /**
     * @param {?} slickItem
     * @return {?}
     */
    SlickComponent.prototype.addSlide = function (slickItem) {
        if (!this.initialized) {
            this.initSlick();
        }
        this.slides.push(slickItem);
        this.$instance.slick('slickAdd', slickItem.el.nativeElement);
    };
    /**
     * @param {?} slickItem
     * @return {?}
     */
    SlickComponent.prototype.removeSlide = function (slickItem) {
        var /** @type {?} */ idx = this.slides.indexOf(slickItem);
        this.$instance.slick('slickRemove', idx);
        this.slides = this.slides.filter(function (s) { return s !== slickItem; });
    };
    /**
     * Slick Method
     * @param {?} index
     * @return {?}
     */
    SlickComponent.prototype.slickGoTo = function (index) {
        var _this = this;
        this.zone.run(function () {
            _this.$instance.slick('slickGoTo', index);
        });
    };
    /**
     * @return {?}
     */
    SlickComponent.prototype.slickNext = function () {
        var _this = this;
        this.zone.run(function () {
            _this.$instance.slick('slickNext');
        });
    };
    /**
     * @return {?}
     */
    SlickComponent.prototype.slickPrev = function () {
        var _this = this;
        this.zone.run(function () {
            _this.$instance.slick('slickPrev');
        });
    };
    /**
     * @return {?}
     */
    SlickComponent.prototype.slickPause = function () {
        var _this = this;
        this.zone.run(function () {
            _this.$instance.slick('slickPause');
        });
    };
    /**
     * @return {?}
     */
    SlickComponent.prototype.slickPlay = function () {
        var _this = this;
        this.zone.run(function () {
            _this.$instance.slick('slickPlay');
        });
    };
    /**
     * @return {?}
     */
    SlickComponent.prototype.unslick = function () {
        var _this = this;
        this.zone.run(function () {
            _this.$instance.slick('unslick');
        });
    };
    return SlickComponent;
}());
SlickComponent.decorators = [
    { type: _angular_core.Component, args: [{
                selector: 'ngx-slick',
                exportAs: 'slick-modal',
                providers: [
                    {
                        provide: _angular_forms.NG_VALUE_ACCESSOR,
                        useExisting: _angular_core.forwardRef(function () { return SlickComponent; }),
                        multi: true
                    }
                ],
                template: '<ng-content></ng-content>',
            },] },
];
/**
 * @nocollapse
 */
SlickComponent.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: _angular_core.NgZone, },
]; };
SlickComponent.propDecorators = {
    'config': [{ type: _angular_core.Input },],
    'afterChange': [{ type: _angular_core.Output },],
    'beforeChange': [{ type: _angular_core.Output },],
    'breakpoint': [{ type: _angular_core.Output },],
    'destroy': [{ type: _angular_core.Output },],
};
var SlickItemDirective = (function () {
    /**
     * @param {?} el
     * @param {?} carousel
     */
    function SlickItemDirective(el, carousel) {
        this.el = el;
        this.carousel = carousel;
    }
    /**
     * @return {?}
     */
    SlickItemDirective.prototype.ngAfterViewInit = function () {
        this.carousel.addSlide(this);
    };
    /**
     * @return {?}
     */
    SlickItemDirective.prototype.ngOnDestroy = function () {
        this.carousel.removeSlide(this);
    };
    return SlickItemDirective;
}());
SlickItemDirective.decorators = [
    { type: _angular_core.Directive, args: [{
                selector: '[ngxSlickItem]',
            },] },
];
/**
 * @nocollapse
 */
SlickItemDirective.ctorParameters = function () { return [
    { type: _angular_core.ElementRef, },
    { type: SlickComponent, decorators: [{ type: _angular_core.Host },] },
]; };

var SlickModule = (function () {
    function SlickModule() {
    }
    /**
     * @return {?}
     */
    SlickModule.forRoot = function () {
        return {
            ngModule: SlickModule,
        };
    };
    return SlickModule;
}());
SlickModule.decorators = [
    { type: _angular_core.NgModule, args: [{
                imports: [
                    _angular_common.CommonModule
                ],
                declarations: [
                    SlickComponent,
                    SlickItemDirective,
                ],
                exports: [
                    SlickComponent,
                    SlickItemDirective,
                ]
            },] },
];
/**
 * @nocollapse
 */
SlickModule.ctorParameters = function () { return []; };

exports.SlickModule = SlickModule;
exports.SlickComponent = SlickComponent;
exports.SlickItemDirective = SlickItemDirective;

Object.defineProperty(exports, '__esModule', { value: true });

})));
