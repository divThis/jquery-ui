/*
 * jQuery UI Rating 1.9
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Rating
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 */
(function( $, undefined ) {

$.widget("ui.rating", {
	version: "@VERSION",

	options: {
		value: null,
		max: null,
		readOnly: false,

		// callbacks
		change: null
	},

	min: 0,

	_create: function() {
		var self = this;

		var ratingDiv = $( "<div class='ui-rating ui-rating-current' />");
		var ratingStar = $( "<a href='#' class='ui-icon ui-rating-star' />");

		var element = self.element.wrap( ratingDiv ).parent();

		$.extend(self, {
			originalElement: this.element,
			element: element
		});

		if (isNaN(parseFloat(self.options.value)))
		{
			self.options.value = parseFloat(self.originalElement.val());
		}

		if (isNaN(parseInt(self.options.max)))
		{
			self.options.max = 0;
		}

		$.each( $( "option", self.originalElement ), function( index, option ) {
			var val = parseInt( $( option ).val(), 0 );

			self.options.max = ( val > self.options.max ) ? val : self.options.max;
		});

		for ( index = 1; index <= self.options.max; index++ ) {
			ratingStar.clone().attr( 'id', 'rating_star_rating_' + index ).text( "Give it a " + index ).data( "rating", index ).appendTo( self.element );
		}

		self.originalElement.hide();

		// self.oldValue = self._getValue();
		self._refreshValue();

		// self.oldReadOnly = self._getReadOnly();
		self._setReadOnly();
	},

	_destroy: function() {
		this.originalElement.siblings().remove().end().show().unwrap( this.element );

		this.element = this.originalElement;

		delete this.originalElement;
		delete this.oldValue;
		delete this.oldReadOnly;
	},

	_events: {
		'click .ui-rating-star': function( event ) {
			event.preventDefault();

			this.options.value = $( event.target ).data( "rating" );

			this._refreshValue();
		},

		mouseover: function( event ) {
			var $target = $( event.target );

			if ( $target.is( ".ui-rating-star" ) ) {
				this.element.removeClass( "ui-rating-current" );
		
				// create referece object for stars
				var ratingStars = $( ".ui-rating-star", this.element );

				// add hover class to the current and preceding stars
				ratingStars.removeClass( "ui-rating-hover" ).filter(function( index ) {
					return index <= ratingStars.index( $target );
				}).addClass( "ui-rating-hover" );

				this._trigger( "change", null, this.ui() );
			}
		},

		mouseleave: function( event ) {
			this.element.addClass( "ui-rating-current" ).find( ".ui-rating-hover" ).removeClass( "ui-rating-hover" );

			this._trigger( "change", null, this.ui() );
		}
	},

	_eventsReadOnly: {
		'click .ui-rating-star': function( event ) {
			event.preventDefault();
		}
	},

	_setOption: function( key, value ) {
		if ( key === "value" ) {
			this.options.value = value;

			this._refreshValue();
		}

		if ( key === "readOnly") {
			this.options.readOnly = value;

			this._setReadOnly( value );
		}

		this._super( "_setOption", key, value );
	},

	_getValue: function() {
		var val = this.options.value;

		// normalize invalid value
		if ( typeof val !== "number" ) {
			val = 0;
		}

		return Math.min( this.options.max, Math.max( this.min, val ) );
	},

	_refreshValue: function() {
		var value = this._getValue();

		if ( this.oldValue !== value ) {
			this.oldValue = value;
			
			$( ".ui-rating-star", this.element ).removeClass( "ui-rating-full ui-rating-partial" ).each( function( index ) {
				index++;

				var starClass = "";

				if ( index <= value ) {
					starClass = "ui-rating-full";
				} else if ( index - value < 1 ) {
					starClass = "ui-rating-partial";
				}

				$( this ).addClass( starClass );
			});

			this.originalElement.val( value );

			this._trigger( "change", null, this.ui() );
		}
	},

	_getReadOnly: function() {
		var val = this.options.readOnly;

		// normalize invalid boolean
		if ( typeof val !== "boolean" )
		{
			val = false;
		}

		return val;
	},

	_setReadOnly: function() {
		var readOnly = this._getReadOnly();

		if ( this.oldReadOnly !== readOnly ) {
			this.oldReadOnly = readOnly;

			if (readOnly === true) {
				// make read only
				this.element.addClass( "ui-rating-readonly ui-rating-current" ).find( ".ui-rating-hover" ).removeClass( "ui-rating-hover" );

				this.bindings.unbind( "." + this.widgetName );

				this._bind( this.element, this._eventsReadOnly);
			} else {
				// make non-read only
				this.element.removeClass('ui-rating-readonly');

				this.bindings.unbind( "." + this.widgetName );

				this._bind( this.element, this._events );
			}

			this._trigger( "change", null, this.ui() );
		}
	},

	ui: function() {
		return {
			element: this.element,
			originalElement: this.originalElement,
			value: this.options.value,
			oldValue: this.oldValue,
			min: this.min,
			max: this.options.max,
			oldReadOnly: this.options.readOnly,
			readOnly: this.options.readOnly
		};
	}
});

}( jQuery ));
