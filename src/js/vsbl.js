var V = require('../../node_modules/velocity-animate/velocity.js');

window.vsbl = (function(window){

  'use strict';

  var _,
      _extend,
      _handler,
      _select,
      _scroll,
      _requestAnimationFrame;

  function vsbl(config){
    _ = this;
    _.els = {};
    _.config = _extend(_.settings, config);
    _.scrolled = _scroll();

    if (_.is_mobile() && !_.config.mobile){
      _.destroy();
      return;
    }

    if (_.config.scope === window.document.documentElement){
      window.addEventListener('scroll', _handler, false);
      window.addEventListener('resize', _handler, false);
    } else {
      _select(_.config.scope).addEventListener('scroll', _handler, false);
    }

    _.init();
  }

  vsbl.prototype = {
    settings: {
      selector:   '[data-vsbl]',

      location:   'bottom',

      mobile:     false,
      reset:      false,

      scope:      window.document.documentElement,

      mode:       'once',

      visibility:    0.6,

      complete:   function(el){}
    },
    default_animation: {
      opacity: [1,0],
      translateY: [0,'15px'],
      backgroundColor: '#ff4567'
    },
    default_options: {
      duration: 400,
      easing: 'ease-in-out'
    },
    init: function(){
      var _dom;
      var _el;

      _dom = Array.prototype.slice.call(_select(_.config.scope).querySelectorAll(_.config.selector));
      _dom.forEach(function(el, i){
        _el = _.els[i] = { el: el };
        _el.shown = false;
        _el.visible = _.isVisible(_el.el);

        _.configure(_el);

        el.removeAttribute('data-vsbl');

        _.animate();
      });

      console.log(_.els);
    },
    animate: function(){
      var i,
          el;
      for (i in _.els){
        el = _.els[i];
        el.visible = _.isVisible(el.el);

        if (el.visible && !el.shown){
          V(el.el, el.animation, el.options); 

          el.visible = true;
          el.shown = true;
          el.el.removeAttribute('style');
        }
      }
    },
    configure: function(_el){
      var options = {},
          _options = {},
          animation = {},
          _animation = {},
          _props = _el.el.getAttribute('data-vsbl').split(/[,]+/);

      // Each comma separated arg
      _props.forEach(function(_prop, i){
        var _prop = _prop.split(/[ ]+/),
            keyword = _prop[0];

        // Each initial keyword in the arg
        switch(keyword){
          case 'move':
            break;

          case 'fade':
            _prop[i+1] ? _animation.opacity = [_prop[i+2]] : null;
            _prop[i+2] ? _animation.opacity.push(_prop[i+1]) : null;

            _options.duration = _prop[i+3];
            break;

          default:
            return;
        }
      });

      options = _extend(options, _.default_options);
      options = _extend(options, _options);

      animation = _extend(animation, _.default_animation);
      animation = _extend(animation, _animation);

      _el.animation = animation;
      _el.options = options;

      return _el;    
    },
    isVisible: function(el){
      let _offset = el.getBoundingClientRect(),
          offset = _offset.top,
          visibility = (el.offsetHeight * _.config.visibility),
          viewport = _.config.scope === document.documentElement ? 
            Math.max(document.documentElement.clientHeight, window.innerHeight || 0) : 
            Math.max(_select(_.config.scope).innerHeight, 0);

      if (_.config.location === 'bottom'){
        if ((_.scrolled + viewport) >= (offset + visibility)){
          return true;
        } else {
          return false;
        }
      }
    },
    is_mobile: function(){
      var agent = navigator.userAgent || navigator.vendor || window.opera;

      return (/(ipad|playbook|silk|android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test( agent )||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test( agent.substr( 0, 4 ))) ? true : false;
    } 
  }

  _handler = function(e){
    _.scrolled = _scroll();
    _requestAnimationFrame(function(){
      _.animate();
    });
  }

  _scroll = function(e){
    return _select(_.config.scope).pageYOffset || _select(_.config.scope).scrollTop; 
  }

  _extend = function(target, src){
    for ( var prop in src ){
      if ( src.hasOwnProperty( prop ) ){
        target[ prop ] = src[ prop ];
      }
    }
    return target;
  }

  _requestAnimationFrame = (function(){
    return  window.requestAnimationFrame        ||
            window.webkitRequestAnimationFrame  ||
            window.mozRequestAnimationFrame     ||

            function( callback ){
              window.setTimeout( callback, 1000 / 60 );
            };
  }());

  _select = function(el){
    if (el === window.document.documentElement){
      return el;
    } else if (el.indexOf('#') > -1){
      return document.getElementById(el);
    } else {
      let _el = Array.prototype.slice.call(document.querySelectorAll(el));
      if (_el.length > 1){
        console.log('The number of elements is too damn high!');
        return _el[0];
      } else {
        return document.querySelector(el);
      }
    }
  }

  return vsbl;
})(window);

module.exports = window.vsbl;
