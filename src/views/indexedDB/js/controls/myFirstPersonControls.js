/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

import {
	MathUtils,
	Spherical,
	Vector3
} from "../build/three.module.js";

var FirstPersonControls = function ( object, domElement ) {

	if ( domElement === undefined ) {

		console.warn( 'THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.' );
		domElement = document;

	}

	this.object = object;
	this.domElement = domElement;

	// API

	this.enabled = true;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.mouseDragOn = false;

	// internals

  this.autoSpeedFactor = 0.0;
  
  this.pageX = 0;
  this.pageY = 0;

	this.mouseX = 0;
  this.mouseY = 0;
  
  this.detaSpeed = 0
  this.verticalSpeed = 1

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	// private variables

	var lat = 0;
	var lon = 0;

	var lookDirection = new Vector3();
	var spherical = new Spherical();
	var target = new Vector3();

	//

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', - 1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = true; break;
				case 2: this.moveBackward = true; break;

			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.mouseDragOn = false;

  };
  
  this.mouseMove = function ( event ) {
    this.pageX = event.pageX
    this.pageY = event.pageY
  }

	this.onMouseMove = function ( type ) {
      this.mouseX = Math.abs(this.pageX - this.viewHalfX)
      this.mouseY = Math.abs(this.pageY - this.viewHalfY)
      switch(type) {
        case 'top':
          if ( this.lookVertical ) lat += this.mouseY * this.detaSpeed * this.verticalSpeed;
          break;
        case 'bottom':
          if ( this.lookVertical ) lat -= this.mouseY * this.detaSpeed * this.verticalSpeed;
          break;
        case 'left':
          lon += this.mouseX * this.detaSpeed;
          break;
        case 'right':
          lon -= this.mouseX * this.detaSpeed;
          break;
      }

		};

	this.onKeyDown = function ( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {

      // 箭头控制
			case 37: /*left 左移*/ this.moveLeft = true; break;
      case 38: /*up 放大*/ this.moveForward = true; break;
      case 39: /*right 右移*/ this.moveRight = true; break;
      case 40: /*down 缩小*/ this.moveBackward = true; break;

      // 上下平移
      // case 82: /*R 上移*/ this.moveDown = true; break;
      // case 70: /*F 下移*/ this.moveUp = true; break;
      
      // 方向控制
			case 87: /*W 上转*/ this.onMouseMove('top'); break;
			case 65: /*A 左转*/ this.onMouseMove('left'); break;
			case 83: /*S 下转*/ this.onMouseMove('bottom'); break;
			case 68: /*D 右转*/ this.onMouseMove('right'); break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch ( event.keyCode ) {
      // 箭头控制
			case 37: /*left 左移*/ this.moveLeft = false; break;
      case 38: /*up 放大*/ this.moveForward = false; break;
      case 39: /*right 右移*/ this.moveRight = false; break;
      case 40: /*down 缩小*/ this.moveBackward = false; break;

      // 上下平移
      case 82: /*R 上移*/ this.moveDown = false; break;
			case 70: /*F 下移*/ this.moveUp = false; break;

		}

	};

	this.lookAt = function ( x, y, z ) {

		if ( x.isVector3 ) {

			target.copy( x );

		} else {

			target.set( x, y, z );

		}

		this.object.lookAt( target );

		setOrientation( this );

		return this;

	};

	this.update = function () {

		var targetPosition = new Vector3();

		return function update( delta ) {

			if ( this.enabled === false ) return;

			if ( this.heightSpeed ) {

				var y = MathUtils.clamp( this.object.position.y, this.heightMin, this.heightMax );
				var heightDelta = y - this.heightMin;

				this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

			} else {

				this.autoSpeedFactor = 0.0;

			}

			var actualMoveSpeed = delta * this.movementSpeed;

			if ( this.moveForward || ( this.autoForward && ! this.moveBackward ) ) this.object.translateZ( - ( actualMoveSpeed + this.autoSpeedFactor ) );
			if ( this.moveBackward ) this.object.translateZ( actualMoveSpeed );

			if ( this.moveLeft ) this.object.translateX( actualMoveSpeed );
			if ( this.moveRight ) this.object.translateX( - actualMoveSpeed );

			if ( this.moveUp ) this.object.translateY( actualMoveSpeed );
			if ( this.moveDown ) this.object.translateY( - actualMoveSpeed );

      var actualLookSpeed = delta * this.lookSpeed;
      this.detaSpeed = delta * this.lookSpeed;

			if ( ! this.activeLook ) {

				actualLookSpeed = 0;

			}

			var verticalLookRatio = 1;

			if ( this.constrainVertical ) {

        verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );
        this.verticalSpeed = Math.PI / ( this.verticalMax - this.verticalMin );

			}

			// lon -= this.mouseX * actualLookSpeed;
			// if ( this.lookVertical ) lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

			lat = Math.max( - 85, Math.min( 85, lat ) );

			var phi = MathUtils.degToRad( 90 - lat );
			var theta = MathUtils.degToRad( lon );

			if ( this.constrainVertical ) {

				phi = MathUtils.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );

			}

			var position = this.object.position;

			targetPosition.setFromSphericalCoords( 1, phi, theta ).add( position );

			this.object.lookAt( targetPosition );

		};

	}();

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function () {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
		this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );

		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );

	};

	var _onMouseMove = bind( this, this.mouseMove );
	var _onMouseDown = bind( this, this.onMouseDown );
	var _onMouseUp = bind( this, this.onMouseUp );
	var _onKeyDown = bind( this, this.onKeyDown );
	var _onKeyUp = bind( this, this.onKeyUp );

  // 监听鼠标
	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
	// this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
	// this.domElement.addEventListener( 'mouseup', _onMouseUp, false );

  // 监听键盘
	window.addEventListener( 'keydown', _onKeyDown, false );
	window.addEventListener( 'keyup', _onKeyUp, false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	function setOrientation( controls ) {

		var quaternion = controls.object.quaternion;

		lookDirection.set( 0, 0, - 1 ).applyQuaternion( quaternion );
		spherical.setFromVector3( lookDirection );

		lat = 90 - MathUtils.radToDeg( spherical.phi );
		lon = MathUtils.radToDeg( spherical.theta );

	}

	this.handleResize();

	setOrientation( this );

};

export { FirstPersonControls };
