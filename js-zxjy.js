( function (global) {
    var document = global.document,
    arr = [],
    push = arr.push,
    slice = arr.slice;

    function itcast ( selector ) {
        return new itcast.fn.init( selector);
    }


        // 功能类方法，实例方法，放在原型上，创建对象才可调用
    itcast.fn = itcast.prototype = {
        constructor:itcast,
        length:0,
        // 把itcast伪数组转换为真数组
        toArray:function () {
            return slice.call( this );
        },
        // get(index)取出index位置的元素，不传取出全部
        get:function ( index ) {
            if(index == null ) {
                return this.toArray();
            }
            return this[ index < 0 ? this.length + index : index];
        },
        // eq(index/-index)
        eq:function ( index ) {
            // 为什么要转换为incast对象
            return itcast(this[index < 0 ? this.length + index : index]);
        },
        first:function () {
            return this.eq( 0 );
        },
        last:function () {
            return this.eq ( -1 );
        },
        // 有疑问
        each:function ( callback ) {
            itcast.each( this,callback );
            return this;
        },
        splice:arr.splice
    };
    

    // 动态添加构造函数
    var　init = itcast.fn.init = function ( selector ) {
        // init构造函数的参数类型
        if( !selector ) {
            return this;
            // 字符串

        } else if ( itcast.isString( selector )) {
            // html字符串
            if ( itcast.isHTML( selector )) {
// 将其转换成html元素，然后以 伪数组形式，将它们存储在this上。
                push.apply( this,itcast.parseHTML( selector ));

            } else {
// 通过querySelectorAll方法获取相应的dom元素，再以伪数组形式存储在this上
                push.apply( this, document.querySelectorAll( selector));
            }

// 将DOM对象转换成itcast对象,创建一个itcast对象，在索引0上的值 为 该DOM对象，
// 同时其length属性也要设置为1.
        } else if ( itcast.isDOM( selector)) {
            this[ 0 ] = selector;
            this.length = 1;
            // DOM数组或伪数组

        } else if ( itcast.isArrayLike( selector)) {
     //  创建一个itcast对象，用该对象去存储数组中的所有dom元素。
            push.apply( this,selector );

        } else if ( itcast.isFunction( selector)) {
// 入口函数，在DOM树加载完毕后，执行该函数。监听document对象的DOMContentLoaded事件，
// 如果该事件触发，就执行入口函数。
            document.addEventListener('DOMContentLoaded',function() {
                 selector();
            });
        }
    };

    init.prototype = itcast.fn;

        // 实现混入式继承
    itcast.extend = itcast.fn.extend = function () {
        var argus = arguments,
        l = argus.length,
        i = 0,
        obj;
        for(; i < l;i++) {
            obj = argus[i];
            for(var k in obj) {
                if(obj.hasOwnProperty( k )) {
                    this[k] = obj[k];
                }
            }
        }
        return this;
    };


    // 工具类方法，在函数身上人人都能用，直接调用即可
    itcast.extend ( {
    // 获取内置对象的方法，判断obj是否为数组
        type:function( obj ) {
            if(obj == null ) {
                return obj + '';
            }
            return typeof obj !== 'object' ? typeof obj :
            Object.prototype.toString.call( obj ).slice(8,-1).toLowerCase();
        },
        // 将html字符串转换为对应的元素节点类型
        parseHTML:function( html ) {
            var ret = [],
            div,
            node;
            div = document.createElement('div');
            div.innerHTML = html;
            for(node = div.firstChild;node;node = div.nextChild) {
                if(node.nodeType === 1) {
                    ret.push(node);
                }
            }
            return ret;
        },
        each:function ( obj,callback ) {
            var i = 0,
                l;
// 如果是数组或伪数组，使用for循环遍历obj，每次遍历都执行回调函数callback，
// 执行时改变this指向，为遍历到的元素，同时给其传入 当前索引以及元素 两个实参，
            if ( itcast.isArrayLike( obj )) {
                l = obj.length;
                for ( ; i< l; i++) {
                    if(callback.call(obj[i],i,obj[i])){
                        break;
                    }
                }
            } else {
// 普通对象,用for in枚举对象属性,执行时改变this指向:为遍历到的元素，并传入 
// 当前属性以及属性值 两个实参，
                for ( i in obj ) {
                    if ( callback.call(obj[i], i, obj[i])) {
                        break;
                    }
                }
            }
            return obj;
        },
        // 数组去重
        unique: function ( arr ) {
            // 去重后的新数组
            var ret = [];
            // 遍历原数组
            itcast.each( arr, function () {
// 如indexOf返回值为-1，则ret不含当前数组
                if( ret.indexOf( this ) === -1) {
                    ret.push( this );
                }
            });
            return ret;
        }
    });


 // 工具类方法，在函数身上人人都能用，直接调用即可
    itcast.extend( {
        // 判断指定参数是否为字符串类型
        isString:function ( obj ) {
            return typeof obj === 'string';
        },
        // 判断指定的参数是否为 html字符串
// 参数是以 '<' 开头 并且 以 '>'结尾 并且 长度最小为3，那么类型为 html字符串
        isHTML:function ( obj ) {
            obj = obj + '';
            return obj[ 0 ] === '<' && obj[ obj.length - 1 ] === '>' && obj.length >= 3;
        },
// 判断指定参数是否为dom对象（dom节点类型）
        isDOM:function ( obj ) {
//如果参数不为 null 或者 undefined值，并且具有nodeType属性，那么类型为 dom对象
            return !!obj && !!obj.nodeType;
        },
    // 判断指定参数是否为 数组 或 伪数组对象
        isArrayLike:function ( obj ) {
// 如不为null和undefined，且具有length属性。获取obj的length属性
            var length = !!obj && 'length' in obj && obj.length;
            var type = itcast.type( obj );//获取obj的类型
             // 过滤函数和window
             if( type === 'function' || itcast.isWindow( obj )) {
                 return false;
             }

             return type === 'array' || length === 0 || 
                    typeof length === 'number' && length > 0 & (length - 1) in obj;
        },
        isFunction:function ( obj ) {
// 如果 typeof 的返回值为 字符串'function',那么类型为 函数
            return typeof obj === 'funciton';
        },
        isWindow:function( obj ) {
// 如果参数值 不为null undefined，并且具有window属性指向自己本身，那么该对象就是全局对象window
            return !!obj && obj.window === obj;
        }
    });

    // DOM操作模块 功能类实例方法
    itcast.fn.extend( {
        // 把左边的追加到右边target目标元素上
       appendTo:function ( target ) {
         var that = this;//缓存this指向的对象
         var ret = [],//存储分配出去的节点
            node;//临时存储要被分配的节点
        target = itcast( target );
        target.each( function ( i,elem ) {
            // 遍历右边的appendTo的调用者
            that.each( function () {
                node = i === 0 ? this:this.cloneNode( true );
                ret.push( node );
                elem.appendChild( node );
            });
        });
        return itcast( ret );
       },
    //    右边的追加到左边,source是要传的元素
       append:function( source ) {
           source = itcast( source );
           source.appendTo( this );
            return this;
       },
//    将itcast对象上的所有dom元素，追加到目标元素的最前边
       prependTo:function ( target ) {
           var ret = [],
           that = this,
           node,
    // 存储目标元素的第一个子节点
           firstChild;
           target = itcast( target );
           target.each( function ( i, elem) {
            // 获取当前目标元素第一个子节点
               firstChild = elem.firstChild;
               that.each( function () {
                   node = i ===0 ? this:this.cloneNode( true );
                   ret.push( node );
            // 将得到的新节点，在firstChild前边给elem添加子节点
                   elem.insertBefore( node,firstChild );
               });
           });
           return itcast( ret );
       },
//   将source上的所有元素，追加到itcast对象上所有目标元素的最前边。
       prepend: function ( source ) {
           source = itcast( source );
           source.prependTo( this );
           return this;
       },
// 获取itcast对象上的所有dom元素的下一个兄弟元素节点，返回值为 itcast对象
       next: function () {
           var ret = [];
           this.each( function ( i,elem ) {
               while ( (elem = elem.nextSibling) && elem.nodeType !==1 ){}
               if( elem != null ) {
                   ret.push( elem );
               }
           });
           return itcast( ret );
       },
// 获取itcast对象上的所有dom元素的下面所有兄弟元素节点，返回值为 itcast对象
       nextAll: function() {
           var ret = [];
           this.each( function (i, elem ) {
               var node = elem.nextSibling;
               while ( node ) {
                   if( node.nodeType === 1) {
                       ret.push( node );
                   }
                   node = node.nextSibling;
               }
           });
           return itcast( itcast.unique( ret ));
       },
    //    将itcast对象上所有dom元素删除掉
       remove: function () {
           return this.each( function () {
               this.parentNoode.removeChild( this );
           });
       },
// 将itcast对象上所有dom元素清空
       empty: function() {
           return this.each( function () {
                this.innerHTML = '';
           });
       },
// 在itcast对象所有元素的前面添加node节点
       before: function ( node ) {
           return this.each( function ( i,elem ) {
               node = itcast( itcast.isString( node) ? document.createTextNode( node ) : node );
               node.each( function (j,cur ) {
                   elem.parentNode.insertBefore( i === 0 ? cur : cur.cloneNode( true ),elem);
               });
           });
       },
    // 在itcast对象所有元素的后面添加node节点
       after: function ( node ) {
            return this.each( function ( i,lem ) {
                var nextSibling = elem.nextSibling;
                node = itcast( itcast.isString( node ) ? document.createTextNode( node ) : node );
                node.each( function ( j,cur ) {
// 通过目标元素获取其父节点，在给它的父节点在 目标元素的下一个兄弟节点之前添加新节点（当前遍历到节点 cur）
               elem.parentNode.insertBefore( i === 0 ? cur : cur.cloneNode( true ),nextSibling);
           });
       });
       }       
    });


 // 属性模块
  itcast.propFix = {
    'class': 'className',
    'for': 'htmlFor'
  };
  itcast.each( [
    "tabIndex",
    "readOnly",
    "maxLength",
    "cellSpacing",
    "cellPadding",
    "rowSpan",
    "colSpan",
    "useMap",
    "frameBorder",
    "contentEditable"
  ], function() {
    	itcast.propFix[ this.toLowerCase() ] = this;
  } );


    // 属性模块
    itcast.fn.extend( {
        // 获取和设置DOM元素的属性节点值
        attr: function ( name,value ) {
            if (value == undefined) {
                if ( typeof name === 'object') {
                    this.each( function ( i, elem ) {
                        for ( var k in name ) {
                            elem.setAttribute( k,name[ k ]);
                        }
                    });
                } else {
                    return this.length === 0 ? undefined : this[0].getAttribute( name );
                }
            } else {
                this.each( function () {
                    this.setAttribute( name,value);
                });
            }
            return this;
        },
        // 获取和设置DOM对象的属性值
        prop: function (name ,value ) {
            var propName;
            if( value == undefined ) {
                if( typeof name === 'object'){
                    this.each( function (i,elem) {
                        for (var k in name ) {
                            propName = propFix[ k ] || k;
                            elem[ propName ] = name [ k ];
                        }
                    });
                } else {
                    propName = propFix[ name ] || name;
                    return this.length === 0 ? undefined : this[ 0 ][ propName ];
                }
            } else {
                this.each( function() {
                    propName = propFix[ name ] || name;
                    this[ propName ] = value;
                });
            }
            return this;
        },
// 获取itcast对象上的第一DOM对象的value属性值；如果itcast对象上没有任何DOM对象，
// 就返回undefined。 或者 给itcast对象上所有DOM对象设置value属性值
        val: function ( value ) {
            // 获取值
            if ( value == undefined ) {
                return this.length === 0 ? undefined : this[0].value;
            } else {
                // 设置值
                return this.each(function () {
                    this.value = value;
                });
            }
        },
// 获取itcast对象上的第一DOM对象的innerHTML属性值；如果itcast对象上没有任何DOM对象，
// 就返回undefined。或者给itcast对象上所有DOM对象设置innerHTML属性值
        html: function( html) {
            if( html == undefined) {
                return this.length === 0 ? undefined : this[ 0 ].innerHTML;
            } else {
                return this.each( function( i,elem ) {
                    elem.innerHTML = html;
                });
            }
        },
// 获取itcast对象上的第一DOM对象的textContent属性值；
// 如果itcast对象上没有任何DOM对象，就返回undefined。或者给itcast对象上所有DOM对象设置
// textContext属性值
        text: function( txt ) {
            if(txt == undefined) {
                return this.length === 0 ? '': this[0].textContext;
            } else {
                return this.each( function( i,elem ) {
                    this.textContext = txt;
                });
            }
        }
    });

    // 样式模块
    itcast.fn.extend( {
        hasClass:function( className ) {
            var ret = false;
            this.each( function( i,elem ) {
                if( this.classList.contains( className )) {
                    ret = true;
                    return false;
                }
            });
            return ret;
        },
        addClass:function( className ) {
            this.each( function( i,lem ) {
                if( !itcast(elem).hasClass(className)) {
                    elem.classList.add(className);
                }
            });
        },
        
         css: function( name,value ) {
            if( value == undefined ) {
                if( typeof name == 'object') {
                    this.each( function( i,elem ) {
                        for( var k in name ) {
                            // elem是否为元素节点
                            // elem.setAttribute( k, name[k] );  属性        属性值
                            (elem.nodeType === 1) && ( elem.style[ k ] = name[ k ]);
                        }
                    });
                } else {
                    // name为字符串类型 获取属性值
                    return this.length === 0 ? undefined : global.getComputedStyle( this[0] )[name];
                }
            } else {
                this.each( function() {
                    this.style[ name ] = value;
                });
            }
            // 设置操作要实现链式编程
            return this;
        },
        removeClass: function( className ) {
           return this.each( function() {
            //    不用考虑样式列表中有没有要删除的样式，因为js会默默的失败，不影响后面操作，
              className == undefined ? this.classList = '': this.classList.remove( className );
           })
        },
        // 有则删除，无则添加
        toggleClass: function( className ) {
           return this.each( function() {
            //    if( !itcast( elem ).hasClass( className )) {
            //        elem.addClass( className )
            //    } else {
            //         elem.removeClass( className );
            //    }
            (itcast( this.classList ).hasClass( className )) ? this.addClass( className ):this.removeClass( className );
            })
        }
    });


     // 事件模块
    itcast.fn.extend({
        on: function( type, callback ) {
            this.each( function() {
                return this.addEventListener( type, callback);
            });
        },
        // remove。。。。删除的是每个事件的处理函数
        off: function( type, calJlback ) {
            this.each( function() {
                return this.removeEventListener( type,callback );
            });
        }
    });
    // 调用on方法
    itcast.each( ('click mousemover mouseup mousedown mouse dblclick keydown keypress mouseout mouseenter' +
                    'mouseove mouseleave keyup focus load blur focusin').split( '' ), function( i ,type) {
                        itcast.fn[ type ] = function( callback ) {
                            return itcast.this.on( type,callback );
                        }
                    });
    // 兼容问题
    if( typeof define === 'function') {
        define( function() {
            return itcast;
        });
    } else if ( typeof exports !== 'undefined') {
        module.exports = itcast;
    } else {
        global.$ = itcast;
    }
} (window));