/*
 * Master Plan - Controller
 * Create: TheBusTeD (tksumeth@gmail.com,kwang@kingsfield.asia)
 * Version: Beta
 * Release: March 3, 2014
 */

function MasterPlan(){
    this.url = $base+'masterplan';
    this.history = {};
    this.device_sm = $window_width <= 992 ? true : false;
    this.type = {
        SG: 'Sky Villa Grande',
        SV: 'Sky Villa',
        OR: 'Pool Villa Type A',
        IR: 'Poll Villa Type B'
    };
}
MasterPlan.prototype = {
    preload: function(){
        var that = this;
        $('body').jpreLoader({
            showSplash: false,
            loaderVPos: '100%'
        }, function(){
            $('body').removeClass('loading');
            $('.preloading').fadeOut('fast');
            that.init();
        });
    },
    init: function(){
        this.rochaliaMasterPlan();
        this.contactUs();
    },
    hashHistory: function(href, title){
        var that = this;
        var title = title === undefined ? document.title : title;
        var hash = window.location.hash;

        if(href !== undefined) {
            if(that.device_sm) {
                window.location = href;
            } else {
                document.title = title+' - '+document.title.split(' - ').pop();
                window.history.replaceState({path:href}, title, href);
            }
        }
    },
    rochaliaMasterPlan: function(){
        var that = this;
        var twice = {};

        /* Functions */
        var func = {
            moveOut: function(target){
                if(!that.device_sm) {
                    target.animate({
                        left: 80,
                        opacity: 0,
                        zIndex: 1
                    }, 'fast');
                }
            },
            moveIn: function(target){
                if(!that.device_sm) {
                    target.css({
                        left: 80,
                    }).animate({
                        left: 0,
                        opacity: 1,
                        zIndex: 3
                    }, 'fast');
                }
            }
        };

        /* Auto selected */
        var content = $('.content');
        var phase = content.data('phase');
        var cunit = content.data('unit');
        if(cunit !== undefined) {
            var chr = cunit.replace(/([A-Z])([0-9]{1,2})$/, '$1');
            chr = (chr == 'S') ? 'SG' : ((chr == 'T') ? 'SV' : chr);
            var num = cunit.replace(/([A-Z])([0-9]{1,2})$/, '$2');
            var	type = (chr == 'SG') ? 'single' : 'twin';
            var area = $('area[data-unit="'+chr+num+'"]');
            var target = $('.unit.'+type);
            var b_unit = $('h2 span:eq(0)', target);
            var b_area = $('h2 span:eq(1)', target);
            var i_unit = $('form', target).find('input[name="contact[unit]"]');
            var i_type = $('form', target).find('input[name="contact[type]"]');

            b_unit.text(chr+num);
            b_area.text(area.data('area'));
            i_unit.val(cunit);
            i_type.val(type.charAt(0).toUpperCase() + type.slice(1) +' Villa');
            target.addClass('show');

            $('.pathview[data-address="'+phase+'"]').css({
                left: 0,
                opacity: 1,
                zIndex: 3
            });
            $('#masterplan').css({
                opacity: 0,
                zIndex: 1
            });
        } else if(phase !== undefined) {
            $('.pathview[data-address="'+phase+'"]').css({
                left: 0,
                opacity: 1,
                zIndex: 3
            });
            $('#masterplan').css({
                opacity: 0,
                zIndex: 1
            });
        }

        /* Relayout by size */
        if(that.device_sm) {
            if(cunit !== undefined) {
                $('#masterplan').hide();
                $('.pathview').hide();
            } else if(phase !== undefined) {
                $('#masterplan').hide();
            } else {
                $('.pathview').hide();
            }
        }

        /* Check div size */
        var plan = $('.plan');
        var mode = plan.height() > plan.width() ? 'X' : 'Y';
        var imgs = plan.find('.map').find('.maparea').find('img');
        $.each(imgs, function(i,e){
            var me = $(e);
            if(mode == 'X') {
                if(e.width > e.height) {
                    me.css('width', '100%');
                } else {
                    me.css('height', '100%');
                }
            } else if(mode == 'Y') {
                if(e.width > e.height) {
                    me.css('height', '100%');
                } else {
                    me.css('width', '100%');
                }
            }
        });

        /* Master Plan */
        var img_masterplan = $('img', $('#masterplan'));
        twice.masterplan = [];
        $('img', $('#masterplan')).mapster({
            mapKey: 'data-key',
            highlight: false,
            fill: true,
            fillColor: '000000',
            fillOpacity: 0.2,
            stroke: false,
            staticState: true,
            isSelectable: false,
            wrapClass: 'mapster_wrap',
            areas: [{
                key: 'phase1',
                highlight: true,
                fillColor: 'FF8400',
                stroke: true,
                strokeColor: 'FF4911',
                staticState: false
            }],
            onClick: function(data){
                var me = $(data.e.target);
                var index = me.index();
                var href = me.prop('href');
                var target = $(me.data('target'));
                if(target.length) {
                    func.moveOut($('#masterplan'));
                    func.moveIn(target);

                    that.hashHistory(href, me.data('prevtitle'));
                }

                $('.phase').fadeOut('fast');
                twice.masterplan[index] =  undefined;
            },
            onMouseout: function(data){
                var me = $(data.e.target);
                var index = me.index();
                var name = me.data('phase');
                var phase = $('.phase.rochalia-'+name);
                phase.fadeOut('fast');
            },
            onMouseover: function(data){
                var me = $(data.e.target);
                var index = me.index();
                var name = me.data('phase');
                var phase = $('.phase.rochalia-'+name);

                /* Phase and Liner fade in */
                phase.fadeIn();

                if(phase.hasClass('moved')) {
                    return false;
                } else {
                    phase.addClass('moved');
                }

                var coords = me[0].coords.split(',');
                var length = coords.length;
                var max_x = false, min_x = false;
                var max_y = false, min_y = false;
                for(i = 0; i < length; i+=2) {
                    var x = parseInt(coords[i]);
                    var y = parseInt(coords[i+1]);
                    max_x = max_x ? ((x > max_x) ? x : max_x) : x;
                    max_y = max_y ? ((y > max_y) ? y : max_y) : y;
                    min_x = min_x ? ((x < min_x) ? x : min_x) : x;
                    min_y = min_y ? ((y < min_y) ? y : min_y) : y;
                }

                /* Description Box */
                var bp_height = phase.outerHeight();
                var bp_width = phase.outerWidth();
                var bp_offset = phase.offset();
                var bp_position = phase.data('position');

                /* Find center */
                var center_x = Math.floor((min_x + ((max_x - min_x) / 2)));
                var center_y = Math.floor((min_y + ((max_y - min_y) / 2)));

                /* Plan */
                var plan = $('.plan');
                var plan_offset = plan.offset();
                var plan_height = plan.outerHeight();

                /* Master Plan */
                var masterplan = $('#masterplan');
                var masterplan_pdt = parseInt(masterplan.css('padding-top'));

                /* Mapster Wrap Offset */
                var mapster_wrap = $('.mapster_wrap');
                var mapster_wrap_width = mapster_wrap.outerWidth();
                var mapster_wrap_height = mapster_wrap.outerHeight();
                var mapster_wrap_offset = mapster_wrap.offset();
                var mapster_wrap_mgr = parseInt(mapster_wrap.css('margin-right'));
                var mapster_wrap_mgt = parseInt(mapster_wrap.css('margin-top'));

                /* Find box position */
                var position = [];
                if(bp_position == 'TL' || bp_position == 'TR') {
                    var top = Math.floor((min_y + mapster_wrap_mgt) - (bp_height / 2));
                    phase.css('top', top < 0 ? 0 : top);
                }
                if(bp_position == 'BL' || bp_position == 'BR') {
                    //var bottom = Math.floor((plan_height - mapster_wrap_height - masterplan_pdt) - 20);
                    phase.css('bottom', 20);
                }
                if(bp_position == 'TL' || bp_position == 'BL') {
                    var left = Math.floor(((mapster_wrap_offset.left - plan_offset.left) + min_x) - (bp_width / 2));
                    phase.css('left', left < 0 ? 0 : left);
                }
                if(bp_position == 'TR' || bp_position == 'BR') {
                    var right = Math.floor((mapster_wrap_mgr + (mapster_wrap_width - max_x)) - (bp_width / 2));
                    phase.css('right', right < 0 ? 0 : right);
                }

                return false;
            }
        });
        /* Phase 1 */
        var color_sold = 'FF0000';
        var color_reserved = 'FFB6C1';
        twice.phase1 = [];
        $('img', $('#phase1')).mapster({
            mapKey: 'data-unit',
            fill: true,
            fillColor: 'FF8400',
            fillOpacity: 0.4,
            stroke: true,
            strokeColor: 'FF4911',
            strokeOpacity: 1,
            strokeWidth: 1,
            isSelectable: false,
            isTouch: true,
            staticState: false,
            wrapClass: 'mapster_wrap',
            /*areas: [{
                key: 'SG11',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SG12',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SG13',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SG14',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SG15',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SG22',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV1',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV2',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV3',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV4',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV13',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV14',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV15',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV16',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV17',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV18',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV19',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            },{
                key: 'SV20',
                fillColor: color_sold,
                fillOpacity: 0.6,
                highlight: false,
                stroke: true,
                strokeColor: color_sold,
                staticState: true
            }],*/
            onClick: function(data){
                var me = $(data.e.target);
                var index = me.index();
                var available = Boolean(me.data('available'));
                if(available) {
                    if(typeof twice.phase1[index] == 'undefined' && is_touch_device()) {
                        if(twice.phase1.length) twice.phase1 = [];
                        twice.phase1[index] = true;
                    } else {
                        var href = me.prop('href');
                        var unit = me.data('unit');
                        var area = me.data('area');
                        var type = unit.match(/^SG/) ? 'single' : 'twin';
                        var target = $('.unit.'+type);
                        var b_unit = $('h2 span:eq(0)', target);
                        var b_area = $('h2 span:eq(1)', target);
                        var i_unit = $('form', target).find('input[name="contact[unit]"]');
                        var i_type = $('form', target).find('input[name="contact[type]"]');
                        var title = me.closest('map').data('nexttitle');

                        b_unit.text(me.data('unit'));
                        b_area.text(me.data('area'));
                        i_unit.val(me.data('unit'));
                        i_type.val(type.charAt(0).toUpperCase() + type.slice(1) +' Villa');
                        if(!that.device_sm) target.addClass('show');

                        that.hashHistory(href, title.replace(/%d%/, me.data('unit')));

                        twice.phase1[index] = undefined;
                    }
                }
            }
        });
        var qtip_show = is_touch_device() ? 'click' : 'mouseenter';
        var qtip_hide = is_touch_device() ? 'click mouseleave' : 'mouseleave';
        $('area', $('map[name="phase1"]')).filter('[data-available="true"]').qtip({
            content: {
                text: function(event) {
                    return $(event.target).data('unit');
                }
            },
            position: {
                my: 'bottom center',
                at: 'top center',
                adjust: {
                    y: 3
                }
            },
            style: {
                classes: 'qtip-unit',
                tip: false
            },
            show: {
                event: qtip_show,
                effect: false
            },
            hide: {
                event: qtip_hide,
                effect: false
            }
        });

        /* Phase 2 */
        $('img', $('#phase2')).mapster({
            fill: true,
            fillColor: '116B9E',
            fillOpacity: 0.4,
            stroke: true,
            strokeColor: '0E2B49',
            strokeOpacity: 1,
            strokeWidth: 1,
            isSelectable: false,
            wrapClass: 'mapster_wrap',
            onMouseover: function(data){
                var target = $(data.e.target);
                var key = target.data('key');
                var num = target.attr('href').replace(/#/, '');
                var area = target.data('area');
                var available = Boolean(target.data('available'));
            },
        });

        /* EVENT ON CLICK */
        $('.map').on('click', '.backto', function(){
            func.moveOut($(this).closest('.map'));
            func.moveIn($('#masterplan'));

            that.hashHistory(this.href, $(this).data('prevtitle'));
            return false;
        });
        $('.map').on('click', '.arrow', function(){
            func.moveOut($(this).closest('.map'));
            func.moveIn($($(this).data('target')));
        });

        /* Animate Content */
        $('.content').css({
            x: ($window_width <= 992) ? 0 : -80
        }).delay(200).transit({
            opacity: 1,
            x: 0
        }, 500);

        /* Zoom */
        var cover = $('.cover');
        var zoom = $('.zoom', cover);
        zoom.on('click', function(){
            var me = $(this);
            var title = me.prop('title');
            var next = me.data('next');
            if(me.hasClass('out')) {
                me.text('+').addClass('in').removeClass('out').attr('title', next).data('next', title);
                me.closest('.cover').addClass('zoomout');
            } else {
                me.text('-').addClass('out').removeClass('in').attr('title', next).data('next', title);
                me.closest('.cover').removeClass('zoomout');
            }
        });
    },
    contactUs: function(){
        var that = this;
        var myValidator = [];

        /* Validator add method telephone number */
        jQuery.validator.addMethod('telephone', function(value, element) {
            return this.optional(element) || /\b[0-9-]{9,}\b/.test(value);
        }, 'Please specify the correct telephone number');

        /* Close */
        var detail = $('.detail');
        var close = $('.close', detail);
        close.on('click', function(){
            if(!that.device_sm) {
                var me = $(this);
                var target = me.closest('.unit.show');
                var i_unit = $('form', target).find('input[name="contact[unit]"]');
                i_unit.val('');
                target.find('.compleated.show').removeClass('show');
                target.removeClass('show');
                myValidator[target.data('type')].resetForm();
            }

            that.hashHistory(this.href, me.data('prevtitle'));
            return false;
        });

        /* Action Hide or Show */
        var action = $('.action', detail);
        action.on('click', function(){
            var me = $(this);
            var target = me.closest('.detail');
            var target_h = target.outerHeight();

            if(me.hasClass('bottom')) {
                target.transition({
                    y: target_h + 40,
                });
                me.text('Contact form').removeClass('bottom').addClass('top');
            } else {
                target.transition({
                    y: 0,
                });
                me.text('View image').removeClass('top').addClass('bottom');
            }
        });

        /* Contact form */
        var form = $('form', $('.enquiry'));
        $.each(form, function(i,e){
            var me = $(e);
            var type = me.closest('.unit').data('type');
            myValidator[type] = me.validate({
                rules: {
                    'contact[name]': 'required',
                    'contact[tel]': {
                        required: true,
                        telephone: true
                    },
                    'contact[email]': {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    'contact[name]': 'Please fill your "Name"',
                    'contact[tel]': {
                        required: 'Please fill your "Telephone Number"',
                        telephone: 'Your "Telephone Number" is not valid.'
                    },
                    'contact[email]': {
                        required: 'Please fill your "E-Mail"',
                        email: 'Your email address must be in the format of name@domain.com'
                    },

                },
                submitHandler: function(form){
                    me.find('.validator-valid').removeClass('validator-valid');
                    me.find('input,textarea').attr('readonly', true);
                    me.find('button').attr('disabled', true);
                    me.find('.sending').removeClass('hide');
                    me.ajaxSubmit({
                        success: function(d,s,x,f){
                            if(s == 'success') {
                                me.find('input,textarea').val('');
                                me.find('input,textarea').attr('readonly', false);
                                me.find('button').attr('disabled', false);
                                me.find('.sending').addClass('hide');
                                me.closest('.enquiry').find('.compleated').addClass('show');
                                myValidator[type].resetForm();
                            }
                        }
                    });
                }
            });
        });
    }
};

var myApp = new MasterPlan();
myApp.preload();
