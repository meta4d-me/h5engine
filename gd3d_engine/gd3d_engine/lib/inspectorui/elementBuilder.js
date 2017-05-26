// Chosen library
(function(){var a,AbstractChosen,Chosen,SelectParser,b,c={}.hasOwnProperty,d=function(a,b){function d(){this.constructor=a}for(var e in b)c.call(b,e)&&(a[e]=b[e]);return d.prototype=b.prototype,a.prototype=new d,a.__super__=b.prototype,a};SelectParser=function(){function SelectParser(){this.options_index=0,this.parsed=[]}return SelectParser.prototype.add_node=function(a){return"OPTGROUP"===a.nodeName.toUpperCase()?this.add_group(a):this.add_option(a)},SelectParser.prototype.add_group=function(a){var b,c,d,e,f,g;for(b=this.parsed.length,this.parsed.push({array_index:b,group:!0,label:this.escapeExpression(a.label),title:a.title?a.title:void 0,children:0,disabled:a.disabled,classes:a.className}),f=a.childNodes,g=[],d=0,e=f.length;e>d;d++)c=f[d],g.push(this.add_option(c,b,a.disabled));return g},SelectParser.prototype.add_option=function(a,b,c){return"OPTION"===a.nodeName.toUpperCase()?(""!==a.text?(null!=b&&(this.parsed[b].children+=1),this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,value:a.value,text:a.text,html:a.innerHTML,title:a.title?a.title:void 0,selected:a.selected,disabled:c===!0?c:a.disabled,group_array_index:b,group_label:null!=b?this.parsed[b].label:null,classes:a.className,style:a.style.cssText})):this.parsed.push({array_index:this.parsed.length,options_index:this.options_index,empty:!0}),this.options_index+=1):void 0},SelectParser.prototype.escapeExpression=function(a){var b,c;return null==a||a===!1?"":/[\&\<\>\"\'\`]/.test(a)?(b={"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},c=/&(?!\w+;)|[\<\>\"\'\`]/g,a.replace(c,function(a){return b[a]||"&amp;"})):a},SelectParser}(),SelectParser.select_to_array=function(a){var b,c,d,e,f;for(c=new SelectParser,f=a.childNodes,d=0,e=f.length;e>d;d++)b=f[d],c.add_node(b);return c.parsed},AbstractChosen=function(){function AbstractChosen(a,b){this.form_field=a,this.options=null!=b?b:{},AbstractChosen.browser_is_supported()&&(this.is_multiple=this.form_field.multiple,this.set_default_text(),this.set_default_values(),this.setup(),this.set_up_html(),this.register_observers(),this.on_ready())}return AbstractChosen.prototype.set_default_values=function(){var a=this;return this.click_test_action=function(b){return a.test_active_click(b)},this.activate_action=function(b){return a.activate_field(b)},this.active_field=!1,this.mouse_on_container=!1,this.results_showing=!1,this.result_highlighted=null,this.allow_single_deselect=null!=this.options.allow_single_deselect&&null!=this.form_field.options[0]&&""===this.form_field.options[0].text?this.options.allow_single_deselect:!1,this.disable_search_threshold=this.options.disable_search_threshold||0,this.disable_search=this.options.disable_search||!1,this.enable_split_word_search=null!=this.options.enable_split_word_search?this.options.enable_split_word_search:!0,this.group_search=null!=this.options.group_search?this.options.group_search:!0,this.search_contains=this.options.search_contains||!1,this.single_backstroke_delete=null!=this.options.single_backstroke_delete?this.options.single_backstroke_delete:!0,this.max_selected_options=this.options.max_selected_options||1/0,this.inherit_select_classes=this.options.inherit_select_classes||!1,this.display_selected_options=null!=this.options.display_selected_options?this.options.display_selected_options:!0,this.display_disabled_options=null!=this.options.display_disabled_options?this.options.display_disabled_options:!0,this.include_group_label_in_selected=this.options.include_group_label_in_selected||!1,this.max_shown_results=this.options.max_shown_results||Number.POSITIVE_INFINITY,this.case_sensitive_search=this.options.case_sensitive_search||!1},AbstractChosen.prototype.set_default_text=function(){return this.form_field.getAttribute("data-placeholder")?this.default_text=this.form_field.getAttribute("data-placeholder"):this.is_multiple?this.default_text=this.options.placeholder_text_multiple||this.options.placeholder_text||AbstractChosen.default_multiple_text:this.default_text=this.options.placeholder_text_single||this.options.placeholder_text||AbstractChosen.default_single_text,this.results_none_found=this.form_field.getAttribute("data-no_results_text")||this.options.no_results_text||AbstractChosen.default_no_result_text},AbstractChosen.prototype.choice_label=function(a){return this.include_group_label_in_selected&&null!=a.group_label?"<b class='group-name'>"+a.group_label+"</b>"+a.html:a.html},AbstractChosen.prototype.mouse_enter=function(){return this.mouse_on_container=!0},AbstractChosen.prototype.mouse_leave=function(){return this.mouse_on_container=!1},AbstractChosen.prototype.input_focus=function(a){var b=this;if(this.is_multiple){if(!this.active_field)return setTimeout(function(){return b.container_mousedown()},50)}else if(!this.active_field)return this.activate_field()},AbstractChosen.prototype.input_blur=function(a){var b=this;return this.mouse_on_container?void 0:(this.active_field=!1,setTimeout(function(){return b.blur_test()},100))},AbstractChosen.prototype.results_option_build=function(a){var b,c,d,e,f,g,h;for(b="",e=0,h=this.results_data,f=0,g=h.length;g>f&&(c=h[f],d="",d=c.group?this.result_add_group(c):this.result_add_option(c),""!==d&&(e++,b+=d),(null!=a?a.first:void 0)&&(c.selected&&this.is_multiple?this.choice_build(c):c.selected&&!this.is_multiple&&this.single_set_selected_text(this.choice_label(c))),!(e>=this.max_shown_results));f++);return b},AbstractChosen.prototype.result_add_option=function(a){var b,c;return a.search_match&&this.include_option_in_results(a)?(b=[],a.disabled||a.selected&&this.is_multiple||b.push("active-result"),!a.disabled||a.selected&&this.is_multiple||b.push("disabled-result"),a.selected&&b.push("result-selected"),null!=a.group_array_index&&b.push("group-option"),""!==a.classes&&b.push(a.classes),c=document.createElement("li"),c.className=b.join(" "),c.style.cssText=a.style,c.setAttribute("data-option-array-index",a.array_index),c.innerHTML=a.search_text,a.title&&(c.title=a.title),this.outerHTML(c)):""},AbstractChosen.prototype.result_add_group=function(a){var b,c;return(a.search_match||a.group_match)&&a.active_options>0?(b=[],b.push("group-result"),a.classes&&b.push(a.classes),c=document.createElement("li"),c.className=b.join(" "),c.innerHTML=a.search_text,a.title&&(c.title=a.title),this.outerHTML(c)):""},AbstractChosen.prototype.results_update_field=function(){return this.set_default_text(),this.is_multiple||this.results_reset_cleanup(),this.result_clear_highlight(),this.results_build(),this.results_showing?this.winnow_results():void 0},AbstractChosen.prototype.reset_single_select_options=function(){var a,b,c,d,e;for(d=this.results_data,e=[],b=0,c=d.length;c>b;b++)a=d[b],a.selected?e.push(a.selected=!1):e.push(void 0);return e},AbstractChosen.prototype.results_toggle=function(){return this.results_showing?this.results_hide():this.results_show()},AbstractChosen.prototype.results_search=function(a){return this.results_showing?this.winnow_results():this.results_show()},AbstractChosen.prototype.winnow_results=function(){var a,b,c,d,e,f,g,h,i,j,k,l;for(this.no_results_clear(),d=0,f=this.get_search_text(),a=f.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),i=new RegExp(a,"i"),c=this.get_search_regex(a),l=this.results_data,j=0,k=l.length;k>j;j++)b=l[j],b.search_match=!1,e=null,this.include_option_in_results(b)&&(b.group&&(b.group_match=!1,b.active_options=0),null!=b.group_array_index&&this.results_data[b.group_array_index]&&(e=this.results_data[b.group_array_index],0===e.active_options&&e.search_match&&(d+=1),e.active_options+=1),b.search_text=b.group?b.label:b.html,(!b.group||this.group_search)&&(b.search_match=this.search_string_match(b.search_text,c),b.search_match&&!b.group&&(d+=1),b.search_match?(f.length&&(g=b.search_text.search(i),h=b.search_text.substr(0,g+f.length)+"</em>"+b.search_text.substr(g+f.length),b.search_text=h.substr(0,g)+"<em>"+h.substr(g)),null!=e&&(e.group_match=!0)):null!=b.group_array_index&&this.results_data[b.group_array_index].search_match&&(b.search_match=!0)));return this.result_clear_highlight(),1>d&&f.length?(this.update_results_content(""),this.no_results(f)):(this.update_results_content(this.results_option_build()),this.winnow_results_set_highlight())},AbstractChosen.prototype.get_search_regex=function(a){var b,c;return b=this.search_contains?"":"^",c=this.case_sensitive_search?"":"i",new RegExp(b+a,c)},AbstractChosen.prototype.search_string_match=function(a,b){var c,d,e,f;if(b.test(a))return!0;if(this.enable_split_word_search&&(a.indexOf(" ")>=0||0===a.indexOf("["))&&(d=a.replace(/\[|\]/g,"").split(" "),d.length))for(e=0,f=d.length;f>e;e++)if(c=d[e],b.test(c))return!0},AbstractChosen.prototype.choices_count=function(){var a,b,c,d;if(null!=this.selected_option_count)return this.selected_option_count;for(this.selected_option_count=0,d=this.form_field.options,b=0,c=d.length;c>b;b++)a=d[b],a.selected&&(this.selected_option_count+=1);return this.selected_option_count},AbstractChosen.prototype.choices_click=function(a){return a.preventDefault(),this.results_showing||this.is_disabled?void 0:this.results_show()},AbstractChosen.prototype.keyup_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),b){case 8:if(this.is_multiple&&this.backstroke_length<1&&this.choices_count()>0)return this.keydown_backstroke();if(!this.pending_backstroke)return this.result_clear_highlight(),this.results_search();break;case 13:if(a.preventDefault(),this.results_showing)return this.result_select(a);break;case 27:return this.results_showing&&this.results_hide(),!0;case 9:case 38:case 40:case 16:case 91:case 17:case 18:break;default:return this.results_search()}},AbstractChosen.prototype.clipboard_event_checker=function(a){var b=this;return setTimeout(function(){return b.results_search()},50)},AbstractChosen.prototype.container_width=function(){return null!=this.options.width?this.options.width:""+this.form_field.offsetWidth+"px"},AbstractChosen.prototype.include_option_in_results=function(a){return this.is_multiple&&!this.display_selected_options&&a.selected?!1:!this.display_disabled_options&&a.disabled?!1:a.empty?!1:!0},AbstractChosen.prototype.search_results_touchstart=function(a){return this.touch_started=!0,this.search_results_mouseover(a)},AbstractChosen.prototype.search_results_touchmove=function(a){return this.touch_started=!1,this.search_results_mouseout(a)},AbstractChosen.prototype.search_results_touchend=function(a){return this.touch_started?this.search_results_mouseup(a):void 0},AbstractChosen.prototype.outerHTML=function(a){var b;return a.outerHTML?a.outerHTML:(b=document.createElement("div"),b.appendChild(a),b.innerHTML)},AbstractChosen.browser_is_supported=function(){return"Microsoft Internet Explorer"===window.navigator.appName?document.documentMode>=8:/iP(od|hone)/i.test(window.navigator.userAgent)||/IEMobile/i.test(window.navigator.userAgent)||/Windows Phone/i.test(window.navigator.userAgent)||/BlackBerry/i.test(window.navigator.userAgent)||/BB10/i.test(window.navigator.userAgent)||/Android.*Mobile/i.test(window.navigator.userAgent)?!1:!0},AbstractChosen.default_multiple_text="Select Some Options",AbstractChosen.default_single_text="Select an Option",AbstractChosen.default_no_result_text="No results match",AbstractChosen}(),a=jQuery,a.fn.extend({chosen:function(b){return AbstractChosen.browser_is_supported()?this.each(function(c){var d,e;return d=a(this),e=d.data("chosen"),"destroy"===b?void(e instanceof Chosen&&e.destroy()):void(e instanceof Chosen||d.data("chosen",new Chosen(this,b)))}):this}}),Chosen=function(c){function Chosen(){return b=Chosen.__super__.constructor.apply(this,arguments)}return d(Chosen,c),Chosen.prototype.setup=function(){return this.form_field_jq=a(this.form_field),this.current_selectedIndex=this.form_field.selectedIndex,this.is_rtl=this.form_field_jq.hasClass("chosen-rtl")},Chosen.prototype.set_up_html=function(){var b,c;return b=["chosen-container"],b.push("chosen-container-"+(this.is_multiple?"multi":"single")),this.inherit_select_classes&&this.form_field.className&&b.push(this.form_field.className),this.is_rtl&&b.push("chosen-rtl"),c={"class":b.join(" "),style:"width: "+this.container_width()+";",title:this.form_field.title},this.form_field.id.length&&(c.id=this.form_field.id.replace(/[^\w]/g,"_")+"_chosen"),this.container=a("<div />",c),this.is_multiple?this.container.html('<ul class="chosen-choices"><li class="search-field"><input type="text" value="'+this.default_text+'" class="default" autocomplete="off" style="width:25px;" /></li></ul><div class="chosen-drop"><ul class="chosen-results"></ul></div>'):this.container.html('<a class="chosen-single chosen-default"><span>'+this.default_text+'</span><div><b></b></div></a><div class="chosen-drop"><div class="chosen-search"><input type="text" autocomplete="off" /></div><ul class="chosen-results"></ul></div>'),this.form_field_jq.hide().after(this.container),this.dropdown=this.container.find("div.chosen-drop").first(),this.search_field=this.container.find("input").first(),this.search_results=this.container.find("ul.chosen-results").first(),this.search_field_scale(),this.search_no_results=this.container.find("li.no-results").first(),this.is_multiple?(this.search_choices=this.container.find("ul.chosen-choices").first(),this.search_container=this.container.find("li.search-field").first()):(this.search_container=this.container.find("div.chosen-search").first(),this.selected_item=this.container.find(".chosen-single").first()),this.results_build(),this.set_tab_index(),this.set_label_behavior()},Chosen.prototype.on_ready=function(){return this.form_field_jq.trigger("chosen:ready",{chosen:this})},Chosen.prototype.register_observers=function(){var a=this;return this.container.bind("touchstart.chosen",function(b){return a.container_mousedown(b),b.preventDefault()}),this.container.bind("touchend.chosen",function(b){return a.container_mouseup(b),b.preventDefault()}),this.container.bind("mousedown.chosen",function(b){a.container_mousedown(b)}),this.container.bind("mouseup.chosen",function(b){a.container_mouseup(b)}),this.container.bind("mouseenter.chosen",function(b){a.mouse_enter(b)}),this.container.bind("mouseleave.chosen",function(b){a.mouse_leave(b)}),this.search_results.bind("mouseup.chosen",function(b){a.search_results_mouseup(b)}),this.search_results.bind("mouseover.chosen",function(b){a.search_results_mouseover(b)}),this.search_results.bind("mouseout.chosen",function(b){a.search_results_mouseout(b)}),this.search_results.bind("mousewheel.chosen DOMMouseScroll.chosen",function(b){a.search_results_mousewheel(b)}),this.search_results.bind("touchstart.chosen",function(b){a.search_results_touchstart(b)}),this.search_results.bind("touchmove.chosen",function(b){a.search_results_touchmove(b)}),this.search_results.bind("touchend.chosen",function(b){a.search_results_touchend(b)}),this.form_field_jq.bind("chosen:updated.chosen",function(b){a.results_update_field(b)}),this.form_field_jq.bind("chosen:activate.chosen",function(b){a.activate_field(b)}),this.form_field_jq.bind("chosen:open.chosen",function(b){a.container_mousedown(b)}),this.form_field_jq.bind("chosen:close.chosen",function(b){a.input_blur(b)}),this.search_field.bind("blur.chosen",function(b){a.input_blur(b)}),this.search_field.bind("keyup.chosen",function(b){a.keyup_checker(b)}),this.search_field.bind("keydown.chosen",function(b){a.keydown_checker(b)}),this.search_field.bind("focus.chosen",function(b){a.input_focus(b)}),this.search_field.bind("cut.chosen",function(b){a.clipboard_event_checker(b)}),this.search_field.bind("paste.chosen",function(b){a.clipboard_event_checker(b)}),this.is_multiple?this.search_choices.bind("click.chosen",function(b){a.choices_click(b)}):this.container.bind("click.chosen",function(a){a.preventDefault()})},Chosen.prototype.destroy=function(){return a(this.container[0].ownerDocument).unbind("click.chosen",this.click_test_action),this.search_field[0].tabIndex&&(this.form_field_jq[0].tabIndex=this.search_field[0].tabIndex),this.container.remove(),this.form_field_jq.removeData("chosen"),this.form_field_jq.show()},Chosen.prototype.search_field_disabled=function(){return this.is_disabled=this.form_field_jq[0].disabled,this.is_disabled?(this.container.addClass("chosen-disabled"),this.search_field[0].disabled=!0,this.is_multiple||this.selected_item.unbind("focus.chosen",this.activate_action),this.close_field()):(this.container.removeClass("chosen-disabled"),this.search_field[0].disabled=!1,this.is_multiple?void 0:this.selected_item.bind("focus.chosen",this.activate_action))},Chosen.prototype.container_mousedown=function(b){return this.is_disabled||(b&&"mousedown"===b.type&&!this.results_showing&&b.preventDefault(),null!=b&&a(b.target).hasClass("search-choice-close"))?void 0:(this.active_field?this.is_multiple||!b||a(b.target)[0]!==this.selected_item[0]&&!a(b.target).parents("a.chosen-single").length||(b.preventDefault(),this.results_toggle()):(this.is_multiple&&this.search_field.val(""),a(this.container[0].ownerDocument).bind("click.chosen",this.click_test_action),this.results_show()),this.activate_field())},Chosen.prototype.container_mouseup=function(a){return"ABBR"!==a.target.nodeName||this.is_disabled?void 0:this.results_reset(a)},Chosen.prototype.search_results_mousewheel=function(a){var b;return a.originalEvent&&(b=a.originalEvent.deltaY||-a.originalEvent.wheelDelta||a.originalEvent.detail),null!=b?(a.preventDefault(),"DOMMouseScroll"===a.type&&(b=40*b),this.search_results.scrollTop(b+this.search_results.scrollTop())):void 0},Chosen.prototype.blur_test=function(a){return!this.active_field&&this.container.hasClass("chosen-container-active")?this.close_field():void 0},Chosen.prototype.close_field=function(){return a(this.container[0].ownerDocument).unbind("click.chosen",this.click_test_action),this.active_field=!1,this.results_hide(),this.container.removeClass("chosen-container-active"),this.clear_backstroke(),this.show_search_field_default(),this.search_field_scale()},Chosen.prototype.activate_field=function(){return this.container.addClass("chosen-container-active"),this.active_field=!0,this.search_field.val(this.search_field.val()),this.search_field.focus()},Chosen.prototype.test_active_click=function(b){var c;return c=a(b.target).closest(".chosen-container"),c.length&&this.container[0]===c[0]?this.active_field=!0:this.close_field()},Chosen.prototype.results_build=function(){return this.parsing=!0,this.selected_option_count=null,this.results_data=SelectParser.select_to_array(this.form_field),this.is_multiple?this.search_choices.find("li.search-choice").remove():this.is_multiple||(this.single_set_selected_text(),this.disable_search||this.form_field.options.length<=this.disable_search_threshold?(this.search_field[0].readOnly=!0,this.container.addClass("chosen-container-single-nosearch")):(this.search_field[0].readOnly=!1,this.container.removeClass("chosen-container-single-nosearch"))),this.update_results_content(this.results_option_build({first:!0})),this.search_field_disabled(),this.show_search_field_default(),this.search_field_scale(),this.parsing=!1},Chosen.prototype.result_do_highlight=function(a){var b,c,d,e,f;if(a.length){if(this.result_clear_highlight(),this.result_highlight=a,this.result_highlight.addClass("highlighted"),d=parseInt(this.search_results.css("maxHeight"),10),f=this.search_results.scrollTop(),e=d+f,c=this.result_highlight.position().top+this.search_results.scrollTop(),b=c+this.result_highlight.outerHeight(),b>=e)return this.search_results.scrollTop(b-d>0?b-d:0);if(f>c)return this.search_results.scrollTop(c)}},Chosen.prototype.result_clear_highlight=function(){return this.result_highlight&&this.result_highlight.removeClass("highlighted"),this.result_highlight=null},Chosen.prototype.results_show=function(){return this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.container.addClass("chosen-with-drop"),this.results_showing=!0,this.search_field.focus(),this.search_field.val(this.search_field.val()),this.winnow_results(),this.form_field_jq.trigger("chosen:showing_dropdown",{chosen:this}))},Chosen.prototype.update_results_content=function(a){return this.search_results.html(a)},Chosen.prototype.results_hide=function(){return this.results_showing&&(this.result_clear_highlight(),this.container.removeClass("chosen-with-drop"),this.form_field_jq.trigger("chosen:hiding_dropdown",{chosen:this})),this.results_showing=!1},Chosen.prototype.set_tab_index=function(a){var b;return this.form_field.tabIndex?(b=this.form_field.tabIndex,this.form_field.tabIndex=-1,this.search_field[0].tabIndex=b):void 0},Chosen.prototype.set_label_behavior=function(){var b=this;return this.form_field_label=this.form_field_jq.parents("label"),!this.form_field_label.length&&this.form_field.id.length&&(this.form_field_label=a("label[for='"+this.form_field.id+"']")),this.form_field_label.length>0?this.form_field_label.bind("click.chosen",function(a){return b.is_multiple?b.container_mousedown(a):b.activate_field()}):void 0},Chosen.prototype.show_search_field_default=function(){return this.is_multiple&&this.choices_count()<1&&!this.active_field?(this.search_field.val(this.default_text),this.search_field.addClass("default")):(this.search_field.val(""),this.search_field.removeClass("default"))},Chosen.prototype.search_results_mouseup=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c.length?(this.result_highlight=c,this.result_select(b),this.search_field.focus()):void 0},Chosen.prototype.search_results_mouseover=function(b){var c;return c=a(b.target).hasClass("active-result")?a(b.target):a(b.target).parents(".active-result").first(),c?this.result_do_highlight(c):void 0},Chosen.prototype.search_results_mouseout=function(b){return a(b.target).hasClass("active-result")?this.result_clear_highlight():void 0},Chosen.prototype.choice_build=function(b){var c,d,e=this;return c=a("<li />",{"class":"search-choice"}).html("<span>"+this.choice_label(b)+"</span>"),b.disabled?c.addClass("search-choice-disabled"):(d=a("<a />",{"class":"search-choice-close","data-option-array-index":b.array_index}),d.bind("click.chosen",function(a){return e.choice_destroy_link_click(a)}),c.append(d)),this.search_container.before(c)},Chosen.prototype.choice_destroy_link_click=function(b){return b.preventDefault(),b.stopPropagation(),this.is_disabled?void 0:this.choice_destroy(a(b.target))},Chosen.prototype.choice_destroy=function(a){return this.result_deselect(a[0].getAttribute("data-option-array-index"))?(this.show_search_field_default(),this.is_multiple&&this.choices_count()>0&&this.search_field.val().length<1&&this.results_hide(),a.parents("li").first().remove(),this.search_field_scale()):void 0},Chosen.prototype.results_reset=function(){return this.reset_single_select_options(),this.form_field.options[0].selected=!0,this.single_set_selected_text(),this.show_search_field_default(),this.results_reset_cleanup(),this.form_field_jq.trigger("change"),this.active_field?this.results_hide():void 0},Chosen.prototype.results_reset_cleanup=function(){return this.current_selectedIndex=this.form_field.selectedIndex,this.selected_item.find("abbr").remove()},Chosen.prototype.result_select=function(a){var b,c;return this.result_highlight?(b=this.result_highlight,this.result_clear_highlight(),this.is_multiple&&this.max_selected_options<=this.choices_count()?(this.form_field_jq.trigger("chosen:maxselected",{chosen:this}),!1):(this.is_multiple?b.removeClass("active-result"):this.reset_single_select_options(),b.addClass("result-selected"),c=this.results_data[b[0].getAttribute("data-option-array-index")],c.selected=!0,this.form_field.options[c.options_index].selected=!0,this.selected_option_count=null,this.is_multiple?this.choice_build(c):this.single_set_selected_text(this.choice_label(c)),(a.metaKey||a.ctrlKey)&&this.is_multiple||this.results_hide(),this.show_search_field_default(),(this.is_multiple||this.form_field.selectedIndex!==this.current_selectedIndex)&&this.form_field_jq.trigger("change",{selected:this.form_field.options[c.options_index].value}),this.current_selectedIndex=this.form_field.selectedIndex,a.preventDefault(),this.search_field_scale())):void 0},Chosen.prototype.single_set_selected_text=function(a){return null==a&&(a=this.default_text),a===this.default_text?this.selected_item.addClass("chosen-default"):(this.single_deselect_control_build(),this.selected_item.removeClass("chosen-default")),this.selected_item.find("span").html(a)},Chosen.prototype.result_deselect=function(a){var b;return b=this.results_data[a],this.form_field.options[b.options_index].disabled?!1:(b.selected=!1,this.form_field.options[b.options_index].selected=!1,this.selected_option_count=null,this.result_clear_highlight(),this.results_showing&&this.winnow_results(),this.form_field_jq.trigger("change",{deselected:this.form_field.options[b.options_index].value}),this.search_field_scale(),!0)},Chosen.prototype.single_deselect_control_build=function(){return this.allow_single_deselect?(this.selected_item.find("abbr").length||this.selected_item.find("span").first().after('<abbr class="search-choice-close"></abbr>'),this.selected_item.addClass("chosen-single-with-deselect")):void 0},Chosen.prototype.get_search_text=function(){return a("<div/>").text(a.trim(this.search_field.val())).html()},Chosen.prototype.winnow_results_set_highlight=function(){var a,b;return b=this.is_multiple?[]:this.search_results.find(".result-selected.active-result"),a=b.length?b.first():this.search_results.find(".active-result").first(),null!=a?this.result_do_highlight(a):void 0},Chosen.prototype.no_results=function(b){var c;return c=a('<li class="no-results">'+this.results_none_found+' "<span></span>"</li>'),c.find("span").first().html(b),this.search_results.append(c),this.form_field_jq.trigger("chosen:no_results",{chosen:this})},Chosen.prototype.no_results_clear=function(){return this.search_results.find(".no-results").remove()},Chosen.prototype.keydown_arrow=function(){var a;return this.results_showing&&this.result_highlight?(a=this.result_highlight.nextAll("li.active-result").first())?this.result_do_highlight(a):void 0:this.results_show()},Chosen.prototype.keyup_arrow=function(){var a;return this.results_showing||this.is_multiple?this.result_highlight?(a=this.result_highlight.prevAll("li.active-result"),a.length?this.result_do_highlight(a.first()):(this.choices_count()>0&&this.results_hide(),this.result_clear_highlight())):void 0:this.results_show()},Chosen.prototype.keydown_backstroke=function(){var a;return this.pending_backstroke?(this.choice_destroy(this.pending_backstroke.find("a").first()),this.clear_backstroke()):(a=this.search_container.siblings("li.search-choice").last(),a.length&&!a.hasClass("search-choice-disabled")?(this.pending_backstroke=a,this.single_backstroke_delete?this.keydown_backstroke():this.pending_backstroke.addClass("search-choice-focus")):void 0)},Chosen.prototype.clear_backstroke=function(){return this.pending_backstroke&&this.pending_backstroke.removeClass("search-choice-focus"),this.pending_backstroke=null},Chosen.prototype.keydown_checker=function(a){var b,c;switch(b=null!=(c=a.which)?c:a.keyCode,this.search_field_scale(),8!==b&&this.pending_backstroke&&this.clear_backstroke(),b){case 8:this.backstroke_length=this.search_field.val().length;break;case 9:this.results_showing&&!this.is_multiple&&this.result_select(a),this.mouse_on_container=!1;break;case 13:this.results_showing&&a.preventDefault();break;case 32:this.disable_search&&a.preventDefault();break;case 38:a.preventDefault(),this.keyup_arrow();break;case 40:a.preventDefault(),this.keydown_arrow()}},Chosen.prototype.search_field_scale=function(){var b,c,d,e,f,g,h,i,j;if(this.is_multiple){for(d=0,h=0,f="position:absolute; left: -1000px; top: -1000px; display:none;",g=["font-size","font-style","font-weight","font-family","line-height","text-transform","letter-spacing"],i=0,j=g.length;j>i;i++)e=g[i],f+=e+":"+this.search_field.css(e)+";";return b=a("<div />",{style:f}),b.text(this.search_field.val()),a("body").append(b),h=b.width()+25,b.remove(),c=this.container.outerWidth(),h>c-10&&(h=c-10),this.search_field.css({width:h+"px"})}},Chosen}(AbstractChosen)}).call(this);

// Jcrop library
!function($){$.Jcrop=function(obj,opt){function px(n){return Math.round(n)+"px"}function cssClass(cl){return options.baseClass+"-"+cl}function supportsColorFade(){return $.fx.step.hasOwnProperty("backgroundColor")}function getPos(obj){var pos=$(obj).offset();return[pos.left,pos.top]}function mouseAbs(e){return[e.pageX-docOffset[0],e.pageY-docOffset[1]]}function setOptions(opt){"object"!=typeof opt&&(opt={}),options=$.extend(options,opt),$.each(["onChange","onSelect","onRelease","onDblClick"],function(i,e){"function"!=typeof options[e]&&(options[e]=function(){})})}function startDragMode(mode,pos,touch){if(docOffset=getPos($img),Tracker.setCursor("move"===mode?mode:mode+"-resize"),"move"===mode)return Tracker.activateHandlers(createMover(pos),doneSelect,touch);var fc=Coords.getFixed(),opp=oppLockCorner(mode),opc=Coords.getCorner(oppLockCorner(opp));Coords.setPressed(Coords.getCorner(opp)),Coords.setCurrent(opc),Tracker.activateHandlers(dragmodeHandler(mode,fc),doneSelect,touch)}function dragmodeHandler(mode,f){return function(pos){if(options.aspectRatio)switch(mode){case"e":pos[1]=f.y+1;break;case"w":pos[1]=f.y+1;break;case"n":pos[0]=f.x+1;break;case"s":pos[0]=f.x+1}else switch(mode){case"e":pos[1]=f.y2;break;case"w":pos[1]=f.y2;break;case"n":pos[0]=f.x2;break;case"s":pos[0]=f.x2}Coords.setCurrent(pos),Selection.update()}}function createMover(pos){var lloc=pos;return KeyManager.watchKeys(),function(pos){Coords.moveOffset([pos[0]-lloc[0],pos[1]-lloc[1]]),lloc=pos,Selection.update()}}function oppLockCorner(ord){switch(ord){case"n":return"sw";case"s":return"nw";case"e":return"nw";case"w":return"ne";case"ne":return"sw";case"nw":return"se";case"se":return"nw";case"sw":return"ne"}}function createDragger(ord){return function(e){return options.disabled?!1:"move"!==ord||options.allowMove?(docOffset=getPos($img),btndown=!0,startDragMode(ord,mouseAbs(e)),e.stopPropagation(),e.preventDefault(),!1):!1}}function presize($obj,w,h){var nw=$obj.width(),nh=$obj.height();nw>w&&w>0&&(nw=w,nh=w/$obj.width()*$obj.height()),nh>h&&h>0&&(nh=h,nw=h/$obj.height()*$obj.width()),xscale=$obj.width()/nw,yscale=$obj.height()/nh,$obj.width(nw).height(nh)}function unscale(c){return{x:c.x*xscale,y:c.y*yscale,x2:c.x2*xscale,y2:c.y2*yscale,w:c.w*xscale,h:c.h*yscale}}function doneSelect(){var c=Coords.getFixed();c.w>options.minSelect[0]&&c.h>options.minSelect[1]?(Selection.enableHandles(),Selection.done()):Selection.release(),Tracker.setCursor(options.allowSelect?"crosshair":"default")}function newSelection(e){if(!options.disabled&&options.allowSelect){btndown=!0,docOffset=getPos($img),Selection.disableHandles(),Tracker.setCursor("crosshair");var pos=mouseAbs(e);return Coords.setPressed(pos),Selection.update(),Tracker.activateHandlers(selectDrag,doneSelect,"touch"===e.type.substring(0,5)),KeyManager.watchKeys(),e.stopPropagation(),e.preventDefault(),!1}}function selectDrag(pos){Coords.setCurrent(pos),Selection.update()}function newTracker(){var trk=$("<div></div>").addClass(cssClass("tracker"));return is_msie&&trk.css({opacity:0,backgroundColor:"white"}),trk}function setClass(cname){$div.removeClass().addClass(cssClass("holder")).addClass(cname)}function animateTo(a,callback){function queueAnimator(){window.setTimeout(animator,interv)}var x1=a[0]/xscale,y1=a[1]/yscale,x2=a[2]/xscale,y2=a[3]/yscale;if(!animating){var animto=Coords.flipCoords(x1,y1,x2,y2),c=Coords.getFixed(),initcr=[c.x,c.y,c.x2,c.y2],animat=initcr,interv=options.animationDelay,ix1=animto[0]-initcr[0],iy1=animto[1]-initcr[1],ix2=animto[2]-initcr[2],iy2=animto[3]-initcr[3],pcent=0,velocity=options.swingSpeed;x1=animat[0],y1=animat[1],x2=animat[2],y2=animat[3],Selection.animMode(!0);var animator=function(){return function(){pcent+=(100-pcent)/velocity,animat[0]=Math.round(x1+pcent/100*ix1),animat[1]=Math.round(y1+pcent/100*iy1),animat[2]=Math.round(x2+pcent/100*ix2),animat[3]=Math.round(y2+pcent/100*iy2),pcent>=99.8&&(pcent=100),100>pcent?(setSelectRaw(animat),queueAnimator()):(Selection.done(),Selection.animMode(!1),"function"==typeof callback&&callback.call(api))}}();queueAnimator()}}function setSelect(rect){setSelectRaw([rect[0]/xscale,rect[1]/yscale,rect[2]/xscale,rect[3]/yscale]),options.onSelect.call(api,unscale(Coords.getFixed())),Selection.enableHandles()}function setSelectRaw(l){Coords.setPressed([l[0],l[1]]),Coords.setCurrent([l[2],l[3]]),Selection.update()}function tellSelect(){return unscale(Coords.getFixed())}function tellScaled(){return Coords.getFixed()}function setOptionsNew(opt){setOptions(opt),interfaceUpdate()}function disableCrop(){options.disabled=!0,Selection.disableHandles(),Selection.setCursor("default"),Tracker.setCursor("default")}function enableCrop(){options.disabled=!1,interfaceUpdate()}function cancelCrop(){Selection.done(),Tracker.activateHandlers(null,null)}function destroy(){$div.remove(),$origimg.show(),$origimg.css("visibility","visible"),$(obj).removeData("Jcrop")}function setImage(src,callback){Selection.release(),disableCrop();var img=new Image;img.onload=function(){var iw=img.width,ih=img.height,bw=options.boxWidth,bh=options.boxHeight;$img.width(iw).height(ih),$img.attr("src",src),$img2.attr("src",src),presize($img,bw,bh),boundx=$img.width(),boundy=$img.height(),$img2.width(boundx).height(boundy),$trk.width(boundx+2*bound).height(boundy+2*bound),$div.width(boundx).height(boundy),Shade.resize(boundx,boundy),enableCrop(),"function"==typeof callback&&callback.call(api)},img.src=src}function colorChangeMacro($obj,color,now){var mycolor=color||options.bgColor;options.bgFade&&supportsColorFade()&&options.fadeTime&&!now?$obj.animate({backgroundColor:mycolor},{queue:!1,duration:options.fadeTime}):$obj.css("backgroundColor",mycolor)}function interfaceUpdate(alt){options.allowResize?alt?Selection.enableOnly():Selection.enableHandles():Selection.disableHandles(),Tracker.setCursor(options.allowSelect?"crosshair":"default"),Selection.setCursor(options.allowMove?"move":"default"),options.hasOwnProperty("trueSize")&&(xscale=options.trueSize[0]/boundx,yscale=options.trueSize[1]/boundy),options.hasOwnProperty("setSelect")&&(setSelect(options.setSelect),Selection.done(),delete options.setSelect),Shade.refresh(),options.bgColor!=bgcolor&&(colorChangeMacro(options.shade?Shade.getShades():$div,options.shade?options.shadeColor||options.bgColor:options.bgColor),bgcolor=options.bgColor),bgopacity!=options.bgOpacity&&(bgopacity=options.bgOpacity,options.shade?Shade.refresh():Selection.setBgOpacity(bgopacity)),xlimit=options.maxSize[0]||0,ylimit=options.maxSize[1]||0,xmin=options.minSize[0]||0,ymin=options.minSize[1]||0,options.hasOwnProperty("outerImage")&&($img.attr("src",options.outerImage),delete options.outerImage),Selection.refresh()}var docOffset,options=$.extend({},$.Jcrop.defaults),_ua=navigator.userAgent.toLowerCase(),is_msie=/msie/.test(_ua),ie6mode=/msie [1-6]\./.test(_ua);"object"!=typeof obj&&(obj=$(obj)[0]),"object"!=typeof opt&&(opt={}),setOptions(opt);var img_css={border:"none",visibility:"visible",margin:0,padding:0,position:"absolute",top:0,left:0},$origimg=$(obj),img_mode=!0;if("IMG"==obj.tagName){if(0!=$origimg[0].width&&0!=$origimg[0].height)$origimg.width($origimg[0].width),$origimg.height($origimg[0].height);else{var tempImage=new Image;tempImage.src=$origimg[0].src,$origimg.width(tempImage.width),$origimg.height(tempImage.height)}var $img=$origimg.clone().removeAttr("id").css(img_css).show();$img.width($origimg.width()),$img.height($origimg.height()),$origimg.after($img).hide()}else $img=$origimg.css(img_css).show(),img_mode=!1,null===options.shade&&(options.shade=!0);presize($img,options.boxWidth,options.boxHeight);var boundx=$img.width(),boundy=$img.height(),$div=$("<div />").width(boundx).height(boundy).addClass(cssClass("holder")).css({position:"relative",backgroundColor:options.bgColor}).insertAfter($origimg).append($img);options.addClass&&$div.addClass(options.addClass);var $img2=$("<div />"),$img_holder=$("<div />").width("100%").height("100%").css({zIndex:310,position:"absolute",overflow:"hidden"}),$hdl_holder=$("<div />").width("100%").height("100%").css("zIndex",320),$sel=$("<div />").css({position:"absolute",zIndex:600}).dblclick(function(){var c=Coords.getFixed();options.onDblClick.call(api,c)}).insertBefore($img).append($img_holder,$hdl_holder);img_mode&&($img2=$("<img />").attr("src",$img.attr("src")).css(img_css).width(boundx).height(boundy),$img_holder.append($img2)),ie6mode&&$sel.css({overflowY:"hidden"});var xlimit,ylimit,xmin,ymin,xscale,yscale,btndown,animating,shift_down,bound=options.boundary,$trk=newTracker().width(boundx+2*bound).height(boundy+2*bound).css({position:"absolute",top:px(-bound),left:px(-bound),zIndex:290}).mousedown(newSelection),bgcolor=options.bgColor,bgopacity=options.bgOpacity;docOffset=getPos($img);var Touch=function(){function hasTouchSupport(){var i,support={},events=["touchstart","touchmove","touchend"],el=document.createElement("div");try{for(i=0;i<events.length;i++){var eventName=events[i];eventName="on"+eventName;var isSupported=eventName in el;isSupported||(el.setAttribute(eventName,"return;"),isSupported="function"==typeof el[eventName]),support[events[i]]=isSupported}return support.touchstart&&support.touchend&&support.touchmove}catch(err){return!1}}function detectSupport(){return options.touchSupport===!0||options.touchSupport===!1?options.touchSupport:hasTouchSupport()}return{createDragger:function(ord){return function(e){return options.disabled?!1:"move"!==ord||options.allowMove?(docOffset=getPos($img),btndown=!0,startDragMode(ord,mouseAbs(Touch.cfilter(e)),!0),e.stopPropagation(),e.preventDefault(),!1):!1}},newSelection:function(e){return newSelection(Touch.cfilter(e))},cfilter:function(e){return e.pageX=e.originalEvent.changedTouches[0].pageX,e.pageY=e.originalEvent.changedTouches[0].pageY,e},isSupported:hasTouchSupport,support:detectSupport()}}(),Coords=function(){function setPressed(pos){pos=rebound(pos),x2=x1=pos[0],y2=y1=pos[1]}function setCurrent(pos){pos=rebound(pos),ox=pos[0]-x2,oy=pos[1]-y2,x2=pos[0],y2=pos[1]}function getOffset(){return[ox,oy]}function moveOffset(offset){var ox=offset[0],oy=offset[1];0>x1+ox&&(ox-=ox+x1),0>y1+oy&&(oy-=oy+y1),y2+oy>boundy&&(oy+=boundy-(y2+oy)),x2+ox>boundx&&(ox+=boundx-(x2+ox)),x1+=ox,x2+=ox,y1+=oy,y2+=oy}function getCorner(ord){var c=getFixed();switch(ord){case"ne":return[c.x2,c.y];case"nw":return[c.x,c.y];case"se":return[c.x2,c.y2];case"sw":return[c.x,c.y2]}}function getFixed(){if(!options.aspectRatio)return getRect();var xx,yy,w,h,aspect=options.aspectRatio,min_x=options.minSize[0]/xscale,max_x=options.maxSize[0]/xscale,max_y=options.maxSize[1]/yscale,rw=x2-x1,rh=y2-y1,rwa=Math.abs(rw),rha=Math.abs(rh),real_ratio=rwa/rha;return 0===max_x&&(max_x=10*boundx),0===max_y&&(max_y=10*boundy),aspect>real_ratio?(yy=y2,w=rha*aspect,xx=0>rw?x1-w:w+x1,0>xx?(xx=0,h=Math.abs((xx-x1)/aspect),yy=0>rh?y1-h:h+y1):xx>boundx&&(xx=boundx,h=Math.abs((xx-x1)/aspect),yy=0>rh?y1-h:h+y1)):(xx=x2,h=rwa/aspect,yy=0>rh?y1-h:y1+h,0>yy?(yy=0,w=Math.abs((yy-y1)*aspect),xx=0>rw?x1-w:w+x1):yy>boundy&&(yy=boundy,w=Math.abs(yy-y1)*aspect,xx=0>rw?x1-w:w+x1)),xx>x1?(min_x>xx-x1?xx=x1+min_x:xx-x1>max_x&&(xx=x1+max_x),yy=yy>y1?y1+(xx-x1)/aspect:y1-(xx-x1)/aspect):x1>xx&&(min_x>x1-xx?xx=x1-min_x:x1-xx>max_x&&(xx=x1-max_x),yy=yy>y1?y1+(x1-xx)/aspect:y1-(x1-xx)/aspect),0>xx?(x1-=xx,xx=0):xx>boundx&&(x1-=xx-boundx,xx=boundx),0>yy?(y1-=yy,yy=0):yy>boundy&&(y1-=yy-boundy,yy=boundy),makeObj(flipCoords(x1,y1,xx,yy))}function rebound(p){return p[0]<0&&(p[0]=0),p[1]<0&&(p[1]=0),p[0]>boundx&&(p[0]=boundx),p[1]>boundy&&(p[1]=boundy),[Math.round(p[0]),Math.round(p[1])]}function flipCoords(x1,y1,x2,y2){var xa=x1,xb=x2,ya=y1,yb=y2;return x1>x2&&(xa=x2,xb=x1),y1>y2&&(ya=y2,yb=y1),[xa,ya,xb,yb]}function getRect(){var delta,xsize=x2-x1,ysize=y2-y1;return xlimit&&Math.abs(xsize)>xlimit&&(x2=xsize>0?x1+xlimit:x1-xlimit),ylimit&&Math.abs(ysize)>ylimit&&(y2=ysize>0?y1+ylimit:y1-ylimit),ymin/yscale&&Math.abs(ysize)<ymin/yscale&&(y2=ysize>0?y1+ymin/yscale:y1-ymin/yscale),xmin/xscale&&Math.abs(xsize)<xmin/xscale&&(x2=xsize>0?x1+xmin/xscale:x1-xmin/xscale),0>x1&&(x2-=x1,x1-=x1),0>y1&&(y2-=y1,y1-=y1),0>x2&&(x1-=x2,x2-=x2),0>y2&&(y1-=y2,y2-=y2),x2>boundx&&(delta=x2-boundx,x1-=delta,x2-=delta),y2>boundy&&(delta=y2-boundy,y1-=delta,y2-=delta),x1>boundx&&(delta=x1-boundy,y2-=delta,y1-=delta),y1>boundy&&(delta=y1-boundy,y2-=delta,y1-=delta),makeObj(flipCoords(x1,y1,x2,y2))}function makeObj(a){return{x:a[0],y:a[1],x2:a[2],y2:a[3],w:a[2]-a[0],h:a[3]-a[1]}}var ox,oy,x1=0,y1=0,x2=0,y2=0;return{flipCoords:flipCoords,setPressed:setPressed,setCurrent:setCurrent,getOffset:getOffset,moveOffset:moveOffset,getCorner:getCorner,getFixed:getFixed}}(),Shade=function(){function resizeShades(w,h){shades.left.css({height:px(h)}),shades.right.css({height:px(h)})}function updateAuto(){return updateShade(Coords.getFixed())}function updateShade(c){shades.top.css({left:px(c.x),width:px(c.w),height:px(c.y)}),shades.bottom.css({top:px(c.y2),left:px(c.x),width:px(c.w),height:px(boundy-c.y2)}),shades.right.css({left:px(c.x2),width:px(boundx-c.x2)}),shades.left.css({width:px(c.x)})}function createShade(){return $("<div />").css({position:"absolute",backgroundColor:options.shadeColor||options.bgColor}).appendTo(holder)}function enableShade(){enabled||(enabled=!0,holder.insertBefore($img),updateAuto(),Selection.setBgOpacity(1,0,1),$img2.hide(),setBgColor(options.shadeColor||options.bgColor,1),Selection.isAwake()?setOpacity(options.bgOpacity,1):setOpacity(1,1))}function setBgColor(color,now){colorChangeMacro(getShades(),color,now)}function disableShade(){enabled&&(holder.remove(),$img2.show(),enabled=!1,Selection.isAwake()?Selection.setBgOpacity(options.bgOpacity,1,1):(Selection.setBgOpacity(1,1,1),Selection.disableHandles()),colorChangeMacro($div,0,1))}function setOpacity(opacity,now){enabled&&(options.bgFade&&!now?holder.animate({opacity:1-opacity},{queue:!1,duration:options.fadeTime}):holder.css({opacity:1-opacity}))}function refreshAll(){options.shade?enableShade():disableShade(),Selection.isAwake()&&setOpacity(options.bgOpacity)}function getShades(){return holder.children()}var enabled=!1,holder=$("<div />").css({position:"absolute",zIndex:240,opacity:0}),shades={top:createShade(),left:createShade().height(boundy),right:createShade().height(boundy),bottom:createShade()};return{update:updateAuto,updateRaw:updateShade,getShades:getShades,setBgColor:setBgColor,enable:enableShade,disable:disableShade,resize:resizeShades,refresh:refreshAll,opacity:setOpacity}}(),Selection=function(){function insertBorder(type){var jq=$("<div />").css({position:"absolute",opacity:options.borderOpacity}).addClass(cssClass(type));return $img_holder.append(jq),jq}function dragDiv(ord,zi){var jq=$("<div />").mousedown(createDragger(ord)).css({cursor:ord+"-resize",position:"absolute",zIndex:zi}).addClass("ord-"+ord);return Touch.support&&jq.bind("touchstart.jcrop",Touch.createDragger(ord)),$hdl_holder.append(jq),jq}function insertHandle(ord){var hs=options.handleSize,div=dragDiv(ord,hdep++).css({opacity:options.handleOpacity}).addClass(cssClass("handle"));return hs&&div.width(hs).height(hs),div}function insertDragbar(ord){return dragDiv(ord,hdep++).addClass("jcrop-dragbar")}function createDragbars(li){var i;for(i=0;i<li.length;i++)dragbar[li[i]]=insertDragbar(li[i])}function createBorders(li){var cl,i;for(i=0;i<li.length;i++){switch(li[i]){case"n":cl="hline";break;case"s":cl="hline bottom";break;case"e":cl="vline right";break;case"w":cl="vline"}borders[li[i]]=insertBorder(cl)}}function createHandles(li){var i;for(i=0;i<li.length;i++)handle[li[i]]=insertHandle(li[i])}function moveto(x,y){options.shade||$img2.css({top:px(-y),left:px(-x)}),$sel.css({top:px(y),left:px(x)})}function resize(w,h){$sel.width(Math.round(w)).height(Math.round(h))}function refresh(){var c=Coords.getFixed();Coords.setPressed([c.x,c.y]),Coords.setCurrent([c.x2,c.y2]),updateVisible()}function updateVisible(select){return awake?update(select):void 0}function update(select){var c=Coords.getFixed();resize(c.w,c.h),moveto(c.x,c.y),options.shade&&Shade.updateRaw(c),awake||show(),select?options.onSelect.call(api,unscale(c)):options.onChange.call(api,unscale(c))}function setBgOpacity(opacity,force,now){(awake||force)&&(options.bgFade&&!now?$img.animate({opacity:opacity},{queue:!1,duration:options.fadeTime}):$img.css("opacity",opacity))}function show(){$sel.show(),options.shade?Shade.opacity(bgopacity):setBgOpacity(bgopacity,!0),awake=!0}function release(){disableHandles(),$sel.hide(),options.shade?Shade.opacity(1):setBgOpacity(1),awake=!1,options.onRelease.call(api)}function showHandles(){seehandles&&$hdl_holder.show()}function enableHandles(){return seehandles=!0,options.allowResize?($hdl_holder.show(),!0):void 0}function disableHandles(){seehandles=!1,$hdl_holder.hide()}function animMode(v){v?(animating=!0,disableHandles()):(animating=!1,enableHandles())}function done(){animMode(!1),refresh()}var awake,hdep=370,borders={},handle={},dragbar={},seehandles=!1;options.dragEdges&&$.isArray(options.createDragbars)&&createDragbars(options.createDragbars),$.isArray(options.createHandles)&&createHandles(options.createHandles),options.drawBorders&&$.isArray(options.createBorders)&&createBorders(options.createBorders),$(document).bind("touchstart.jcrop-ios",function(e){$(e.currentTarget).hasClass("jcrop-tracker")&&e.stopPropagation()});var $track=newTracker().mousedown(createDragger("move")).css({cursor:"move",position:"absolute",zIndex:360});return Touch.support&&$track.bind("touchstart.jcrop",Touch.createDragger("move")),$img_holder.append($track),disableHandles(),{updateVisible:updateVisible,update:update,release:release,refresh:refresh,isAwake:function(){return awake},setCursor:function(cursor){$track.css("cursor",cursor)},enableHandles:enableHandles,enableOnly:function(){seehandles=!0},showHandles:showHandles,disableHandles:disableHandles,animMode:animMode,setBgOpacity:setBgOpacity,done:done}}(),Tracker=function(){function toFront(touch){$trk.css({zIndex:450}),touch?$(document).bind("touchmove.jcrop",trackTouchMove).bind("touchend.jcrop",trackTouchEnd):trackDoc&&$(document).bind("mousemove.jcrop",trackMove).bind("mouseup.jcrop",trackUp)}function toBack(){$trk.css({zIndex:290}),$(document).unbind(".jcrop")}function trackMove(e){return onMove(mouseAbs(e)),!1}function trackUp(e){return e.preventDefault(),e.stopPropagation(),btndown&&(btndown=!1,onDone(mouseAbs(e)),Selection.isAwake()&&options.onSelect.call(api,unscale(Coords.getFixed())),toBack(),onMove=function(){},onDone=function(){}),!1}function activateHandlers(move,done,touch){return btndown=!0,onMove=move,onDone=done,toFront(touch),!1}function trackTouchMove(e){return onMove(mouseAbs(Touch.cfilter(e))),!1}function trackTouchEnd(e){return trackUp(Touch.cfilter(e))}function setCursor(t){$trk.css("cursor",t)}var onMove=function(){},onDone=function(){},trackDoc=options.trackDocument;return trackDoc||$trk.mousemove(trackMove).mouseup(trackUp).mouseout(trackUp),$img.before($trk),{activateHandlers:activateHandlers,setCursor:setCursor}}(),KeyManager=function(){function watchKeys(){options.keySupport&&($keymgr.show(),$keymgr.focus())}function onBlur(){$keymgr.hide()}function doNudge(e,x,y){options.allowMove&&(Coords.moveOffset([x,y]),Selection.updateVisible(!0)),e.preventDefault(),e.stopPropagation()}function parseKey(e){if(e.ctrlKey||e.metaKey)return!0;shift_down=e.shiftKey?!0:!1;var nudge=shift_down?10:1;switch(e.keyCode){case 37:doNudge(e,-nudge,0);break;case 39:doNudge(e,nudge,0);break;case 38:doNudge(e,0,-nudge);break;case 40:doNudge(e,0,nudge);break;case 27:options.allowSelect&&Selection.release();break;case 9:return!0}return!1}var $keymgr=$('<input type="radio" />').css({position:"fixed",left:"-120px",width:"12px"}).addClass("jcrop-keymgr"),$keywrap=$("<div />").css({position:"absolute",overflow:"hidden"}).append($keymgr);return options.keySupport&&($keymgr.keydown(parseKey).blur(onBlur),ie6mode||!options.fixedSupport?($keymgr.css({position:"absolute",left:"-20px"}),$keywrap.append($keymgr).insertBefore($img)):$keymgr.insertBefore($img)),{watchKeys:watchKeys}}();Touch.support&&$trk.bind("touchstart.jcrop",Touch.newSelection),$hdl_holder.hide(),interfaceUpdate(!0);var api={setImage:setImage,animateTo:animateTo,setSelect:setSelect,setOptions:setOptionsNew,tellSelect:tellSelect,tellScaled:tellScaled,setClass:setClass,disable:disableCrop,enable:enableCrop,cancel:cancelCrop,release:Selection.release,destroy:destroy,focus:KeyManager.watchKeys,getBounds:function(){return[boundx*xscale,boundy*yscale]},getWidgetSize:function(){return[boundx,boundy]},getScaleFactor:function(){return[xscale,yscale]},getOptions:function(){return options},ui:{holder:$div,selection:$sel}};return is_msie&&$div.bind("selectstart",function(){return!1}),$origimg.data("Jcrop",api),api},$.fn.Jcrop=function(options,callback){var api;return this.each(function(){if($(this).data("Jcrop")){if("api"===options)return $(this).data("Jcrop");$(this).data("Jcrop").setOptions(options)}else"IMG"==this.tagName?$.Jcrop.Loader(this,function(){$(this).css({display:"block",visibility:"hidden"}),api=$.Jcrop(this,options),$.isFunction(callback)&&callback.call(api)}):($(this).css({display:"block",visibility:"hidden"}),api=$.Jcrop(this,options),$.isFunction(callback)&&callback.call(api))}),this},$.Jcrop.Loader=function(imgobj,success,error){function completeCheck(){img.complete?($img.unbind(".jcloader"),$.isFunction(success)&&success.call(img)):window.setTimeout(completeCheck,50)}var $img=$(imgobj),img=$img[0];$img.bind("load.jcloader",completeCheck).bind("error.jcloader",function(){$img.unbind(".jcloader"),$.isFunction(error)&&error.call(img)}),img.complete&&$.isFunction(success)&&($img.unbind(".jcloader"),success.call(img))},$.Jcrop.defaults={allowSelect:!0,allowMove:!0,allowResize:!0,trackDocument:!0,baseClass:"jcrop",addClass:null,bgColor:"black",bgOpacity:.6,bgFade:!1,borderOpacity:.4,handleOpacity:.5,handleSize:null,aspectRatio:0,keySupport:!0,createHandles:["n","s","e","w","nw","ne","se","sw"],createDragbars:["n","s","e","w"],createBorders:["n","s","e","w"],drawBorders:!0,dragEdges:!0,fixedSupport:!0,touchSupport:null,shade:null,boxWidth:0,boxHeight:0,boundary:2,fadeTime:400,animationDelay:20,swingSpeed:3,minSelect:[0,0],maxSize:[0,0],minSize:[0,0],onChange:function(){},onSelect:function(){},onDblClick:function(){},onRelease:function(){}}}(jQuery);

/*! tinyColorPicker - v1.1.1 2016-08-30 */

!function(a,b){"object"==typeof exports?module.exports=b(a):"function"==typeof define&&define.amd?define("colors",[],function(){return b(a)}):a.Colors=b(a)}(this,function(a,b){"use strict";function c(a,c,d,f,g){if("string"==typeof c){var c=v.txt2color(c);d=c.type,p[d]=c[d],g=g!==b?g:c.alpha}else if(c)for(var h in c)a[d][h]=k(c[h]/l[d][h][1],0,1);return g!==b&&(a.alpha=k(+g,0,1)),e(d,f?a:b)}function d(a,b,c){var d=o.options.grey,e={};return e.RGB={r:a.r,g:a.g,b:a.b},e.rgb={r:b.r,g:b.g,b:b.b},e.alpha=c,e.equivalentGrey=n(d.r*a.r+d.g*a.g+d.b*a.b),e.rgbaMixBlack=i(b,{r:0,g:0,b:0},c,1),e.rgbaMixWhite=i(b,{r:1,g:1,b:1},c,1),e.rgbaMixBlack.luminance=h(e.rgbaMixBlack,!0),e.rgbaMixWhite.luminance=h(e.rgbaMixWhite,!0),o.options.customBG&&(e.rgbaMixCustom=i(b,o.options.customBG,c,1),e.rgbaMixCustom.luminance=h(e.rgbaMixCustom,!0),o.options.customBG.luminance=h(o.options.customBG,!0)),e}function e(a,b){var c,e,k,q=b||p,r=v,s=o.options,t=l,u=q.RND,w="",x="",y={hsl:"hsv",rgb:a},z=u.rgb;if("alpha"!==a){for(var A in t)if(!t[A][A]){a!==A&&(x=y[A]||"rgb",q[A]=r[x+"2"+A](q[x])),u[A]||(u[A]={}),c=q[A];for(w in c)u[A][w]=n(c[w]*t[A][w][1])}z=u.rgb,q.HEX=r.RGB2HEX(z),q.equivalentGrey=s.grey.r*q.rgb.r+s.grey.g*q.rgb.g+s.grey.b*q.rgb.b,q.webSave=e=f(z,51),q.webSmart=k=f(z,17),q.saveColor=z.r===e.r&&z.g===e.g&&z.b===e.b?"web save":z.r===k.r&&z.g===k.g&&z.b===k.b?"web smart":"",q.hueRGB=v.hue2RGB(q.hsv.h),b&&(q.background=d(z,q.rgb,q.alpha))}var B,C,D,E=q.rgb,F=q.alpha,G="luminance",H=q.background;return B=i(E,{r:0,g:0,b:0},F,1),B[G]=h(B,!0),q.rgbaMixBlack=B,C=i(E,{r:1,g:1,b:1},F,1),C[G]=h(C,!0),q.rgbaMixWhite=C,s.customBG&&(D=i(E,H.rgbaMixCustom,F,1),D[G]=h(D,!0),D.WCAG2Ratio=j(D[G],H.rgbaMixCustom[G]),q.rgbaMixBGMixCustom=D,D.luminanceDelta=m.abs(D[G]-H.rgbaMixCustom[G]),D.hueDelta=g(H.rgbaMixCustom,D,!0)),q.RGBLuminance=h(z),q.HUELuminance=h(q.hueRGB),s.convertCallback&&s.convertCallback(q,a),q}function f(a,b){var c={},d=0,e=b/2;for(var f in a)d=a[f]%b,c[f]=a[f]+(d>e?b-d:-d);return c}function g(a,b,c){return(m.max(a.r-b.r,b.r-a.r)+m.max(a.g-b.g,b.g-a.g)+m.max(a.b-b.b,b.b-a.b))*(c?255:1)/765}function h(a,b){for(var c=b?1:255,d=[a.r/c,a.g/c,a.b/c],e=o.options.luminance,f=d.length;f--;)d[f]=d[f]<=.03928?d[f]/12.92:m.pow((d[f]+.055)/1.055,2.4);return e.r*d[0]+e.g*d[1]+e.b*d[2]}function i(a,c,d,e){var f={},g=d!==b?d:1,h=e!==b?e:1,i=g+h*(1-g);for(var j in a)f[j]=(a[j]*g+c[j]*h*(1-g))/i;return f.a=i,f}function j(a,b){var c=1;return c=a>=b?(a+.05)/(b+.05):(b+.05)/(a+.05),n(100*c)/100}function k(a,b,c){return a>c?c:b>a?b:a}var l={rgb:{r:[0,255],g:[0,255],b:[0,255]},hsv:{h:[0,360],s:[0,100],v:[0,100]},hsl:{h:[0,360],s:[0,100],l:[0,100]},alpha:{alpha:[0,1]},HEX:{HEX:[0,16777215]}},m=a.Math,n=m.round,o={},p={},q={r:.298954,g:.586434,b:.114612},r={r:.2126,g:.7152,b:.0722},s=function(a){this.colors={RND:{}},this.options={color:"rgba(0,0,0,0)",grey:q,luminance:r,valueRanges:l},t(this,a||{})},t=function(a,d){var e,f=a.options;u(a);for(var g in d)d[g]!==b&&(f[g]=d[g]);e=f.customBG,f.customBG="string"==typeof e?v.txt2color(e).rgb:e,p=c(a.colors,f.color,b,!0)},u=function(a){o!==a&&(o=a,p=a.colors)};s.prototype.setColor=function(a,d,f){return u(this),a?c(this.colors,a,d,b,f):(f!==b&&(this.colors.alpha=k(f,0,1)),e(d))},s.prototype.setCustomBackground=function(a){return u(this),this.options.customBG="string"==typeof a?v.txt2color(a).rgb:a,c(this.colors,b,"rgb")},s.prototype.saveAsBackground=function(){return u(this),c(this.colors,b,"rgb",!0)},s.prototype.toString=function(a,b){return v.color2text((a||"rgb").toLowerCase(),this.colors,b)};var v={txt2color:function(a){var b={},c=a.replace(/(?:#|\)|%)/g,"").split("("),d=(c[1]||"").split(/,\s*/),e=c[1]?c[0].substr(0,3):"rgb",f="";if(b.type=e,b[e]={},c[1])for(var g=3;g--;)f=e[g]||e.charAt(g),b[e][f]=+d[g]/l[e][f][1];else b.rgb=v.HEX2rgb(c[0]);return b.alpha=d[3]?+d[3]:1,b},color2text:function(a,b,c){var d=c!==!1&&n(100*b.alpha)/100,e="number"==typeof d&&c!==!1&&(c||1!==d),f=b.RND.rgb,g=b.RND.hsl,h="hex"===a&&e,i="hex"===a&&!h,j="rgb"===a||h,k=j?f.r+", "+f.g+", "+f.b:i?"#"+b.HEX:g.h+", "+g.s+"%, "+g.l+"%";return i?k:(h?"rgb":a)+(e?"a":"")+"("+k+(e?", "+d:"")+")"},RGB2HEX:function(a){return((a.r<16?"0":"")+a.r.toString(16)+(a.g<16?"0":"")+a.g.toString(16)+(a.b<16?"0":"")+a.b.toString(16)).toUpperCase()},HEX2rgb:function(a){return a=a.split(""),{r:+("0x"+a[0]+a[a[3]?1:0])/255,g:+("0x"+a[a[3]?2:1]+(a[3]||a[1]))/255,b:+("0x"+(a[4]||a[2])+(a[5]||a[2]))/255}},hue2RGB:function(a){var b=6*a,c=~~b%6,d=6===b?0:b-c;return{r:n(255*[1,1-d,0,0,d,1][c]),g:n(255*[d,1,1,1-d,0,0][c]),b:n(255*[0,0,d,1,1,1-d][c])}},rgb2hsv:function(a){var b,c,d,e=a.r,f=a.g,g=a.b,h=0;return g>f&&(f=g+(g=f,0),h=-1),c=g,f>e&&(e=f+(f=e,0),h=-2/6-h,c=m.min(f,g)),b=e-c,d=e?b/e:0,{h:1e-15>d?p&&p.hsl&&p.hsl.h||0:b?m.abs(h+(f-g)/(6*b)):0,s:e?b/e:p&&p.hsv&&p.hsv.s||0,v:e}},hsv2rgb:function(a){var b=6*a.h,c=a.s,d=a.v,e=~~b,f=b-e,g=d*(1-c),h=d*(1-f*c),i=d*(1-(1-f)*c),j=e%6;return{r:[d,h,g,g,i,d][j],g:[i,d,d,h,g,g][j],b:[g,g,i,d,d,h][j]}},hsv2hsl:function(a){var b=(2-a.s)*a.v,c=a.s*a.v;return c=a.s?1>b?b?c/b:0:c/(2-b):0,{h:a.h,s:a.v||c?c:p&&p.hsl&&p.hsl.s||0,l:b/2}},rgb2hsl:function(a,b){var c=v.rgb2hsv(a);return v.hsv2hsl(b?c:p.hsv=c)},hsl2rgb:function(a){var b=6*a.h,c=a.s,d=a.l,e=.5>d?d*(1+c):d+c-c*d,f=d+d-e,g=e?(e-f)/e:0,h=~~b,i=b-h,j=e*g*i,k=f+j,l=e-j,m=h%6;return{r:[e,l,f,f,k,e][m],g:[k,e,e,l,f,f][m],b:[f,f,k,e,e,l][m]}}};return s}),function(a,b){"object"==typeof exports?module.exports=b(a,require("jquery"),require("colors")):"function"==typeof define&&define.amd?define(["jquery","colors"],function(c,d){return b(a,c,d)}):b(a,a.jQuery,a.Colors)}(this,function(a,b,c,d){"use strict";function e(a){return a.value||a.getAttribute("value")||b(a).css("background-color")||"#FFF"}function f(a){return a=a.originalEvent&&a.originalEvent.touches?a.originalEvent.touches[0]:a,a.originalEvent?a.originalEvent:a}function g(a){return b(a.find(r.doRender)[0]||a[0])}function h(c){var d=b(this),f=d.offset(),h=b(a),k=r.gap;c?(s=g(d),s._colorMode=s.data("colorMode"),p.$trigger=d,(t||i()).css(r.positionCallback.call(p,d)||{left:(t._left=f.left)-((t._left+=t._width-(h.scrollLeft()+h.width()))+k>0?t._left+k:0),top:(t._top=f.top+d.outerHeight())-((t._top+=t._height-(h.scrollTop()+h.height()))+k>0?t._top+k:0)}).show(r.animationSpeed,function(){c!==!0&&(y.toggle(!!r.opacity)._width=y.width(),v._width=v.width(),v._height=v.height(),u._height=u.height(),q.setColor(e(s[0])),n(!0))}).off(".tcp").on(D,".cp-xy-slider,.cp-z-slider,.cp-alpha",j)):p.$trigger&&b(t).hide(r.animationSpeed,function(){n(!1),p.$trigger=null}).off(".tcp")}function i(){return b("head")[r.cssPrepend?"prepend":"append"]('<style type="text/css" id="tinyColorPickerStyles">'+(r.css||I)+(r.cssAddon||"")+"</style>"),b(H).css({margin:r.margin}).appendTo("body").show(0,function(){p.$UI=t=b(this),F=r.GPU&&t.css("perspective")!==d,u=b(".cp-z-slider",this),v=b(".cp-xy-slider",this),w=b(".cp-xy-cursor",this),x=b(".cp-z-cursor",this),y=b(".cp-alpha",this),z=b(".cp-alpha-cursor",this),r.buildCallback.call(p,t),t.prepend("<div>").children().eq(0).css("width",t.children().eq(0).width()),t._width=this.offsetWidth,t._height=this.offsetHeight}).hide()}function j(a){var c=this.className.replace(/cp-(.*?)(?:\s*|$)/,"$1").replace("-","_");(a.button||a.which)>1||(a.preventDefault&&a.preventDefault(),a.returnValue=!1,s._offset=b(this).offset(),(c="xy_slider"===c?k:"z_slider"===c?l:m)(a),n(),A.on(E,function(){A.off(".tcp")}).on(C,function(a){c(a),n()}))}function k(a){var b=f(a),c=b.pageX-s._offset.left,d=b.pageY-s._offset.top;q.setColor({s:c/v._width*100,v:100-d/v._height*100},"hsv")}function l(a){var b=f(a).pageY-s._offset.top;q.setColor({h:360-b/u._height*360},"hsv")}function m(a){var b=f(a).pageX-s._offset.left,c=b/y._width;q.setColor({},"rgb",c)}function n(a){var b=q.colors,c=b.hueRGB,e=(b.RND.rgb,b.RND.hsl,r.dark),f=r.light,g=q.toString(s._colorMode,r.forceAlpha),h=b.HUELuminance>.22?e:f,i=b.rgbaMixBlack.luminance>.22?e:f,j=(1-b.hsv.h)*u._height,k=b.hsv.s*v._width,l=(1-b.hsv.v)*v._height,m=b.alpha*y._width,n=F?"translate3d":"",p=s[0].value,t=s[0].hasAttribute("value")&&""===p&&a!==d;v._css={backgroundColor:"rgb("+c.r+","+c.g+","+c.b+")"},w._css={transform:n+"("+k+"px, "+l+"px, 0)",left:F?"":k,top:F?"":l,borderColor:b.RGBLuminance>.22?e:f},x._css={transform:n+"(0, "+j+"px, 0)",top:F?"":j,borderColor:"transparent "+h},y._css={backgroundColor:"#"+b.HEX},z._css={transform:n+"("+m+"px, 0, 0)",left:F?"":m,borderColor:i+" transparent"},s._css={backgroundColor:t?"":g,color:t?"":b.rgbaMixBGMixCustom.luminance>.22?e:f},s.text=t?"":p!==g?g:"",a!==d?o(a):G(o)}function o(a){v.css(v._css),w.css(w._css),x.css(x._css),y.css(y._css),z.css(z._css),r.doRender&&s.css(s._css),s.text&&s.val(s.text),r.renderCallback.call(p,s,"boolean"==typeof a?a:d)}var p,q,r,s,t,u,v,w,x,y,z,A=b(document),B=b(),C="touchmove.tcp mousemove.tcp pointermove.tcp",D="touchstart.tcp mousedown.tcp pointerdown.tcp",E="touchend.tcp mouseup.tcp pointerup.tcp",F=!1,G=a.requestAnimationFrame||a.webkitRequestAnimationFrame||function(a){a()},H='<div class="cp-color-picker"><div class="cp-z-slider"><div class="cp-z-cursor"></div></div><div class="cp-xy-slider"><div class="cp-white"></div><div class="cp-xy-cursor"></div></div><div class="cp-alpha"><div class="cp-alpha-cursor"></div></div></div>',I=".cp-color-picker{position:absolute;overflow:hidden;padding:6px 6px 0;background-color:#444;color:#bbb;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;cursor:default;border-radius:5px}.cp-color-picker>div{position:relative;overflow:hidden}.cp-xy-slider{float:left;height:128px;width:128px;margin-bottom:6px;background:linear-gradient(to right,#FFF,rgba(255,255,255,0))}.cp-white{height:100%;width:100%;background:linear-gradient(rgba(0,0,0,0),#000)}.cp-xy-cursor{position:absolute;top:0;width:10px;height:10px;margin:-5px;border:1px solid #fff;border-radius:100%;box-sizing:border-box}.cp-z-slider{float:right;margin-left:6px;height:128px;width:20px;background:linear-gradient(red 0,#f0f 17%,#00f 33%,#0ff 50%,#0f0 67%,#ff0 83%,red 100%)}.cp-z-cursor{position:absolute;margin-top:-4px;width:100%;border:4px solid #fff;border-color:transparent #fff;box-sizing:border-box}.cp-alpha{clear:both;width:100%;height:16px;margin:6px 0;background:linear-gradient(to right,#444,rgba(0,0,0,0))}.cp-alpha-cursor{position:absolute;margin-left:-4px;height:100%;border:4px solid #fff;border-color:#fff transparent;box-sizing:border-box}",J=function(a){q=this.color=new c(a),r=q.options,p=this};J.prototype={render:n,toggle:h},b.fn.colorPicker=function(c){var d=this,f=function(){};return c=b.extend({animationSpeed:150,GPU:!0,doRender:!0,customBG:"#FFF",opacity:!0,renderCallback:f,buildCallback:f,positionCallback:f,body:document.body,scrollResize:!0,gap:4,dark:"#222",light:"#DDD"},c),!p&&c.scrollResize&&b(a).on("resize.tcp scroll.tcp",function(){p.$trigger&&p.toggle.call(p.$trigger[0],!0)}),B=B.add(this),this.colorPicker=p||new J(c),this.options=c,b(c.body).off(".tcp").on(D,function(a){-1===B.add(t).add(b(t).find(a.target)).index(a.target)&&h()}),this.on("focusin.tcp click.tcp",function(a){p.color.options=b.extend(p.color.options,r=d.options),h.call(this,a)}).on("change.tcp",function(){q.setColor(this.value||"#FFF"),d.colorPicker.render(!0)}).each(function(){var a=e(this),d=a.split("("),f=g(b(this));f.data("colorMode",d[1]?d[0].substr(0,3):"HEX").attr("readonly",r.preventFocus),c.doRender&&f.css({"background-color":a,color:function(){return q.setColor(a).rgbaMixBGMixCustom.luminance>.22?c.dark:c.light}})})},b.fn.colorPicker.destroy=function(){b("*").off(".tcp"),p.toggle(!1),B=b()}});

// Element builder library
var EleBuilder = function(element) {

	// Container compent
	this.compentDefaults = {
		title: 'compent',
		operate: 0,
		data: '',
		after: '',
		onoperate: ''
	};
	// Container grid
	this.gridDefault = {
		title: 'grid',
		layout: 0,	// 0 vertical | 1 transverse
		after: ''
	};
	// Element input
	this.inputDefault = {
		title: '',
		value: '',
		data: '',
		onblur: '',
		onfocus: ''
	};
	// Element Range
	this.rangeDefault = {
		title: '',
		data: '',
		withInput: false,
		value: 0,
		max: 100,
		min: 0,
		onchange: ''
	},
	// Element Color
	this.colorDefault = {
		title: '',
		data: '',
		value: '#FFFFFF',
		onchange: ''
	},
	// Element textarea
	this.textareaDefault = {
		title: '',
		value: '',
		data: '',
		onblur: ''
	};
	// Element button
	this.buttonDefault = {
		title: '',
		value: 'button',
		data: '',
		onclick: ''
	};
	// Element checkbox
	this.checkboxDefault = {
		title: '',
		name: '',
		options: [],
		data: '',
		onchange: ''
	};
	// Element radio
	this.radioDefault = {
		title: '',
		name: '',
		options: [],
		data: '',
		onchange: ''
	};
	// Element select
	this.selectDefault = {
		title: '',
		name: '',
		options: [],
		data: '',
		onchange: ''
	};
	// Element block
	this.blockDefault = {
		onchange: ''
	};
	// Element imageCut
	this.imageCutDefault = {
		imageUrl: '',
		onchange: ''
	};
	// Element chosen
	this.chosenDefault = {
		title: '',
		value: 'Chosen',
		search: true,
		options: [],
		onclick: ''
	};
	// Element drag
	this.dragDefault = {
		title: '',
		data: '',
		type: '',
		chosen: {
			search: true,
			options: [],
			onclick: ''
		}
	};

	// TODO
	this.compentOperate = {
		none: '',
        remove: {key: 0x00000002, name: 'Remove'},
        reset: {key: 0x00000004, name: 'Reset'},
        copyComponent: {key: 0x00000008, name: 'CopyComponent'},
        pasteValues: {key: 0x00000010, name: 'PasteValues'},
        pasteAsNewComponent: {key: 0x00000020, name: 'PasteAsNewComponent'},
        resetPosition: {key: 0x00000040, name: 'ResetPosition'},
        resetRotation: {key: 0x00000080, name: 'Remove'},
        resetScale: {key: 0x00000100, name: 'ResetScale'},
        moveUp: {key: 0x00000200, name: 'MoveUp'},
        moveDown: {key: 0x00000400, name: 'MoveDown'},
        editorShader : {key: 0x00000800, name: 'EditorShader'}
	};
	
	this.element = element;
};

EleBuilder.prototype = {

	// Random
	generateRandom: function(count){ 
		var count = typeof count != 'undefined' ? count : 8;
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

		for( var i=0; i < count; i++ )
			text += possible.charAt(Math.floor(Math.random() * possible.length));

		return text;
	},

	compent: function(options, index){
		
		this.options = $.extend(true, {}, this.compentDefaults, options);

		var compent = $('<div class="ele_build_compent"><div class="ele_build_compent_header"><h4 class="ele_build_compent_header_title ele_build_icon ele_build_16_downT">compent</h4><div class="ele_build_options ele_build_16_settings"></div></div><div class="ele_build_compent_contents"></div></div>');
		
		compent.find('.ele_build_compent_header_title').text(this.options.title);
		
		// Add drop menu
		var dropMenu = $('<ul class="ele_build_drop_menu ele_build_right_direction"></ul>');

		if(typeof this.options.operate == 'number' && this.options.operate > 0)
		{
			for(var type in this.compentOperate)
			{
				var operate = this.compentOperate[type];
				if(operate.key > 0 && this.options.operate & operate.key)
				{
					dropMenu.append('<li operate="'+operate.key+'"><a href="javascript:;"><span class="ele_build_label">'+operate.name+'</span></a></li>');
				}
			}
		}
		
		compent.find('.ele_build_options').append(dropMenu);
		
		// Contents
		var contents = compent.find('.ele_build_compent_contents');
		
		compent.on('click', '.ele_build_compent_header_title', function(){
			var _this = $(this);
			
			if( contents.css('display') == 'block' )
			{
				contents.css('display', 'none');
				_this.removeClass('ele_build_16_downT').addClass('ele_build_16_cHorizontal');
			}
			else
			{
				contents.css('display', 'block');
				_this.removeClass('ele_build_16_cHorizontal').addClass('ele_build_16_downT');
			}
		})
		
		compent.on('click', '.ele_build_options', function(event){

			event=event||window.event;
            event.stopPropagation();

			if( dropMenu.css('display') == 'block' )
			{
				dropMenu.css('display', 'none');
			}
			else
			{
				dropMenu.css('display', 'block');
				
				// Once
				$(document).one('click', function(){
					dropMenu.css('display', 'none');
				});
			}
		})

		var cloneContainer = this.element;
		var onOperate = typeof this.options.onoperate == 'function' ? this.options.onoperate : '';
		var operateData = this.options.data;

		compent.on('click', '.ele_build_drop_menu > li', function()
		{
			var _this = $(this);
			var operate = _this.attr('operate');

			// Remove
			if(operate == 1)
			{
				//compent.remove();
			}

			// Reset
			if(operate == 2)
			{
				var compentIndex = compent.index();
				compent.remove();
				
				var elementBuilder = new EleBuilder(cloneContainer);
				elementBuilder.compent(options, compentIndex);
			}

			if(typeof onOperate == 'function')
			{
				onOperate(operate, operateData);
			}
		});
		
		if(typeof index != 'undefined')
		{
			if(index > 0)
			{
				var prevCompent = this.element.children().eq(index-1);
				prevCompent.after(compent);
			}
			else
			{
				this.element.prepend(compent);
			}
		}
		else
		{
			this.element.append(compent);
		}
		
		// After function call && clone this
		var newElementObject = $.extend(true, {}, this);
		newElementObject.element = contents;

		typeof this.options.after == 'function' ? this.options.after(newElementObject, contents) : eval(this.options.after);

		return contents;
	},
	
	line: function(){
		
		var line = $('<span class="ele_build_hr"></span>');
		this.element.append(line);
		return line;
	},
	
	grid: function(options){
		
		this.options = $.extend(true, {}, this.gridDefault, options);
		
		var grid = $('<div class="ele_build_compent_grid"><div class="ele_build_col_3"><span class="ele_build_label">title</span></div><div class="ele_build_col_9"></div><div class="ele_build_clear"></div></div>');
		
		grid.find('.ele_build_label').text(this.options.title);
		
		this.element.append(grid);
		
		var contents = grid.find('.ele_build_col_9');
		
		// Set layout attributes
		if(typeof options.layout == 'number')
		{
			contents.attr('layout', options.layout);
		}
		
		// After function call && clone this
		var newElementObject = $.extend(true, {}, this);
		newElementObject.element = contents;

		typeof this.options.after == 'function' ? this.options.after(newElementObject, grid) : eval(this.options.after);

		return contents;
		
	},

	__refreshElement: function(options, type, element){

		if(type == 'select' || type == 'checkbox' || type == 'radio')
		{
			var elementOptions = typeof options.options == 'object' ? options.options : [];

			if(type == 'select')
			{
				var select = element.find('select');

				for(var i in elementOptions)
				{
					var elementOptionStatus = elementOptions[i];
					select.children().eq(i).attr('selected', elementOptionStatus ? true : false);
				}
			}
			else
			{
				for(var i in elementOptions)
				{
					var elementOptionStatus = elementOptions[i];
					element.find('input').eq(i).prop('checked', elementOptionStatus ? true : false);
				}
			}
		}
		else if(type == 'chosen')
		{
			var elementOptions = typeof options.options == 'object' ? 
				options.options : 
				(typeof options.chosen == 'object' && typeof options.chosen.options == 'object' ? 
					options.chosen.options : 
					[]);

			element.empty();

			for(var i in elementOptions)
			{
				var elementItemOptions = elementOptions[i];
				var elementItem = $('<option></option>');

				if(typeof elementItemOptions.selected != 'undefined' && elementItemOptions.selected == true)
				{
					elementItem.attr('selected', true);

					// Set drag default value
					var dragElement = element.parents('.ele_build_drag_container').find('.ele_build_drag_bar');
					if(dragElement.length){
						dragElement.find('input').val(elementItemOptions.value);
					}
				}

				elementItem.val(elementItemOptions.value).text(elementItemOptions.key);
				element.append(elementItem);
			}

			element.trigger("chosen:updated");
		}
		else
		{
			element.val(options.value);
		}

		return element;
	},
	
	__makeElement: function(options, type, element, item){
		
		var hasTitle = false;
		
		//var element = element;
		if(type == 'select' || type == 'checkbox' || type == 'radio')
		{
			var name = typeof options.name == 'string' ? options.name : '';
			var elementOptions = typeof options.options == 'object' ? options.options : [];

			if(type == 'select')
			{
				var id = 'element-' + type + '-' + this.generateRandom();
				var select = element.find('select');

				select.attr({id: id, name: name});

				for(var i in elementOptions)
				{
					var elementItemOptions = elementOptions[i];
					var elementItem = typeof item == 'object' ? item.clone() : $('');

					if(typeof elementItemOptions.selected != 'undefined' && elementItemOptions.selected == true)
					{
						elementItem.attr('selected', true);
					}

					elementItem.val(elementItemOptions.value).text(elementItemOptions.key);
					select.append(elementItem);
				}
			}
			else
			{
				// Checkbox / radio
				var id = 'element-' + type + '-box-' + this.generateRandom(15);
				element.attr('id', id);

				for(var i in elementOptions)
				{
					var elementId = 'element-'+type+'-' + this.generateRandom();
					var elementItemOptions = elementOptions[i];
					var elementItem = typeof item == 'object' ? item.clone() : $('');

					if(typeof elementItemOptions.checked != 'undefined' && elementItemOptions.checked)
					{
						elementItem.find('input').attr('checked', true);
					}

					elementItem.find('input').attr({name: name, id: elementId}).val(elementItemOptions.value);
					elementItem.find('.ele_build_label').attr('for', elementId).text(elementItemOptions.key);

					element.append(elementItem);
				}
			}
		}
		else if(type == 'chosen')
		{
			var placeholder = typeof options.value == 'string' ? options.value : '';
			var elementOptions = typeof options.options == 'object' ? options.options : [];

			var dragElement = typeof options.drag == 'undefined' ? null : options.drag;
			var dragData = typeof options.dragData == 'undefined' ? null : options.dragData;

			var id = 'element-' + type + '-' + this.generateRandom();

			element.attr({id: id});
			element.attr('data-placeholder', placeholder);

			elementOptions.unshift({key:'', value:''});

			for(var i in elementOptions)
			{
				var elementItemOptions = elementOptions[i];
				var elementItem = $('<option></option>');

				if(typeof elementItemOptions.selected != 'undefined' && elementItemOptions.selected == true)
				{
					elementItem.attr('selected', true);

					// Set drag default value
					if(dragElement && dragElement.length){
						dragElement.val(elementItemOptions.value);
					}
				}

				elementItem.val(elementItemOptions.value).text(elementItemOptions.key);
				element.append(elementItem);
			}
		}
		else if(type == 'range')
		{
			var id = 'element-'+type+'-' + this.generateRandom();

			var rangeElement = options.withInput ? element.find('input[type=range]') : element;
			var rangeValueElement = element.find('input[type=text]');

			if(rangeValueElement.length)
			{
				var rangeValueId = 'element-rangevalue-' + this.generateRandom();
				rangeValueElement.val(options.value);
				rangeValueElement.attr('id', rangeValueId);
			}

			rangeElement.val(options.value);
			rangeElement.attr('id', id);
			rangeElement.attr('max', options.max);
			rangeElement.attr('min', options.min);
		}
		else if(type == 'drag')
		{
			var id = 'element-'+type+'-' + this.generateRandom();

			element.attr('id', id);

			if(options.type == '')
			{
				element.find('input').css('padding-left', 8);
			}
			
			element.find('i').attr('class', options.type);
			element.find('input').val(options.value);
		}
		else
		{
			var id = 'element-'+type+'-' + this.generateRandom();

			element.val(options.value);
			element.attr('id', id);
		}

		if(type == 'color')
		{
			element.colorPicker({
				color: options.value,
				customBG: '#222',
				margin: '4px -2px 0',
				doRender: 'div div',

				buildCallback: function($elm) {
					var colorInstance = this.color,
						colorPicker = this;

					$elm.prepend('<div class="cp-panel">' +
						'R <input type="text" class="cp-r" /><br>' +
						'G <input type="text" class="cp-g" /><br>' +
						'B <input type="text" class="cp-b" /><hr>' +
						'H <input type="text" class="cp-h" /><br>' +
						'S <input type="text" class="cp-s" /><br>' +
						'B <input type="text" class="cp-v" /><hr>' +
						'<input type="text" class="cp-HEX" />' +
					'</div>').on('change', 'input', function(e) {
						var value = this.value,
							className = this.className,
							type = className.split('-')[1],
							color = {};

						color[type] = value;
						colorInstance.setColor(type === 'HEX' ? value : color,
							type === 'HEX' ? 'HEX' : /(?:r|g|b)/.test(type) ? 'rgb' : 'hsv');
						colorPicker.render();
						this.blur();
						element.blur();
					});
				},

				cssAddon: // could also be in a css file instead
					'.cp-color-picker{box-sizing:border-box; width:226px;}' +
					'.cp-color-picker .cp-panel {line-height: 21px; float:right;' +
						'padding:0 1px 0 8px; margin-top:-1px; overflow:visible}' +
					'.cp-xy-slider:active {cursor:none;}' +
					'.cp-panel, .cp-panel input {color:#bbb; font-family:monospace,' +
						'"Courier New",Courier,mono; font-size:12px; font-weight:bold;}' +
					'.cp-panel input {width:28px; height:12px; padding:2px 3px 1px;' +
						'text-align:right; line-height:12px; background:transparent;' +
						'border:1px solid; border-color:#222 #666 #666 #222;}' +
					'.cp-panel hr {margin:0 -2px 2px; height:1px; border:0;' +
						'background:#666; border-top:1px solid #222;}' +
					'.cp-panel .cp-HEX {width:44px; position:absolute; margin:1px -3px 0 -2px;}' +
					'.cp-alpha {width:155px;}',

				renderCallback: function($elm, toggled) {
					var colors = this.color.colors.RND,
						modes = {
							r: colors.rgb.r, g: colors.rgb.g, b: colors.rgb.b, a: this.color.colors.alpha,
							h: colors.hsv.h, s: colors.hsv.s, v: colors.hsv.v,
							HEX: this.color.colors.HEX
						};

					$('input', '.cp-panel').each(function() {
						this.value = modes[this.className.substr(3)];
					});

					typeof options.onchange == 'function' ? options.onchange(modes, options.data) : eval(options.onchange);
				}
			}); // that's it
		}

		var region = $('<div class="ele_build_compent_region"></div>');
		
		if(typeof options.title == 'string' && options.title != '')
		{
			hasTitle = true;
			
			region.append('<span class="ele_build_label element_build_title">'+options.title+'</span>');
			region.append($('<span class="ele_build_elements"></span>').append(element));
		}
		else
		{
			region.append(element);
		}

		// Set region center
		if(region.children().length == 1 && region.find('input[type=button], .ele_build_chosen').length == 1)
		{
			region.css('text-align', 'center');
		}
		
		this.element.append(region);
		
		// Layout transverse
		if(this.element.attr('layout') == 1)
		{
			//Region count
			var elementRegion = this.element.find('.ele_build_compent_region');
			var regionCount = elementRegion.length;
			var percent = 100 / regionCount;
			
			elementRegion.css('width', percent+'%');
		}
		
		// Set elements absolute left
		if(hasTitle)
		{
			var regionTitleWidth = region.find('.ele_build_label').width();
			region.find('.ele_build_elements').css('left', regionTitleWidth + 10);
		}
		
		if((typeof options.onblur == 'string' || typeof options.onblur == 'function') && options.onblur != '')
		{
			this.element.on('blur', '#'+id, function(){
				typeof options.onblur == 'function' ? options.onblur(element, options.data) : eval(options.onblur);
			});
		}

		if((typeof options.onfocus == 'string' || typeof options.onfocus == 'function') && options.onfocus != '')
		{
			this.element.on('focus', '#'+id, function(){
				typeof options.onfocus == 'function' ? options.onfocus(element, options.data) : eval(options.onfocus);
			});
		}
		
		if((typeof options.onclick == 'string' || typeof options.onclick == 'function') && options.onclick != '')
		{
			this.element.on('click', '#'+id, function(){
				typeof options.onclick == 'function' ? options.onclick(element, options.data) : eval(options.onclick);
			});
		}

		// Radio \ select \ checkbox
		if((typeof options.onchange == 'string' || typeof options.onchange == 'function') && options.onchange != '')
		{
			if(type == 'select' || type == 'checkbox' || type == 'radio')
			{
				if(type == 'checkbox' || type == 'radio')
				{
					this.element.on('click', '#'+id+' input', function(){
						
						var elementItems = $(this).parents('.ele_build_box').find('input');

						if(type == 'radio')
						{
							var checkedIndex = null;
							elementItems.each(function(index){
								var status = $(this).is(':checked') ? 1 : 0;
								if(status)
									checkedIndex = index;
							});
						}
						else
						{
							var checkedIndex = [];

							elementItems.each(function(index){
								var status = $(this).is(':checked') ? 1 : 0;
								checkedIndex.push(status);
							});
						}

						typeof options.onchange == 'function' ? options.onchange(checkedIndex, options.data) : eval(options.onchange);
					});
				}
				else
				{
					this.element.on('change', '#'+id, function(){
						var checkedIndex = $(this).find(':selected').index();
						typeof options.onchange == 'function' ? options.onchange(checkedIndex, options.data) : eval(options.onchange);
					});
				}
			}
		}

		// Input enter 
		if(type == 'input')
		{
			this.element.on('keypress', '#'+id, function(e){
				if(e.which == 13)
					$(this).blur();
			});
		}

		// Range change
		if(type == 'range')
		{
			this.element.on('input propertychange', '#'+id, function(){
				var _this = $(this);
				typeof rangeValueElement != 'undefined' && rangeValueElement.val(_this.val());
				typeof options.onchange == 'function' ? options.onchange(_this.val(), options.data) : eval(options.onchange);
			});

			if(typeof rangeValueElement != 'undefined' && rangeValueElement.length)
			{
				this.element.on('blur', '#'+rangeValueId, function(){
					var _this = $(this);
					$('#'+id).val(_this.val());
				});

				this.element.on('keypress', '#'+rangeValueId, function(e){
					if(e.which == 13)
						$(this).blur();
				});
			}
		}

		// textarea autoHeight
		if(type == 'textarea')
		{
			var textareaScrollHeight = $('#'+id)[0].scrollHeight;

			$('#'+id).parents('.ele_build_compent_region').css('height', textareaScrollHeight);
			$('#'+id).css('height', textareaScrollHeight)
		}

		// chosen
		if(type == 'chosen')
		{
			var chosenSearch = (typeof options.search != 'undefined' && options.search) ? false : true;
			element.chosen({disable_search: chosenSearch});

			var onclick = typeof options.onclick == 'function' ? options.onclick : '';

			this.element.on('change', '#'+id, function(){
				var _this = $(this);
				
				if(dragElement && dragElement.length){
					dragElement.val(_this.val())
				}

				typeof onclick == 'function' ? onclick(_this.val(), dragElement, dragData) : eval(onclick);

				if(typeof options.drag == 'undefined')
				{
					_this.val('');
					_this.trigger('chosen:updated');
				}
			});
		}

		// Reload && return
		var __self = this;

		element.reload = function(options){
			__self.__refreshElement(options, type, element);
		}

		return element;
	},

	__checkOptions: function(options, defaultOptions){

		var extendOptions = $.extend(true, {}, defaultOptions, options);

		for(var item in extendOptions)
		{
			if( typeof defaultOptions[item] == 'undefined')
			{
				delete extendOptions[item];
			}
		}

		return extendOptions;
	},
	
	input: function(options){
		
		this.options = this.__checkOptions(options, this.inputDefault);
		var element = $('<input type="text" class="ele_build_input">');
		
		return this.__makeElement(this.options, 'input', element);
	},

	range: function(options){

		this.options = this.__checkOptions(options, this.rangeDefault);
		
		if(this.options.withInput)
		{
			var element = $('<div class="ele_build_range_container"><div class="ele_build_bar"><input type="range" class="ele_build_range"></div><div class="ele_build_range_value"><input type="text" class="ele_build_input"></div></div>');
		}
		else
		{
			var element = $('<input type="range" class="ele_build_range">');
		}
		
		return this.__makeElement(this.options, 'range', element);
	},

	color: function(options){
		
		this.options = this.__checkOptions(options, this.colorDefault);
		var element = $('<input type="text" class="ele_build_input">');
		
		return this.__makeElement(this.options, 'color', element);
	},
	
	textarea: function(options){
		
		this.options = this.__checkOptions(options, this.textareaDefault);
		var element = $('<textarea class="ele_build_textarea" disabled></textarea>');
		
		return this.__makeElement(this.options, 'textarea', element);
	},
	
	button: function(options){
		
		this.options = this.__checkOptions(options, this.buttonDefault);
		var element = $('<input type="button" class="ele_build_button">');
		
		return this.__makeElement(this.options, 'button', element);
	},

	checkbox: function(options){

		this.options = this.__checkOptions(options, this.checkboxDefault);
		var element = $('<div class="ele_build_box"></div>');
		var item = $('<div class="ele_build_option"><div class="ele_build_checker"><input type="checkbox"></div><label class="ele_build_label ele_build_inline"></label></div>');

		return this.__makeElement(this.options, 'checkbox', element, item);
	},

	radio: function(options){

		this.options = this.__checkOptions(options, this.radioDefault);
		var element = $('<div class="ele_build_box"></div>');
		var item = $('<div class="ele_build_option"><div class="ele_build_radio"><input type="radio"></div><label class="ele_build_label ele_build_inline"></label></div>');

		return this.__makeElement(this.options, 'radio', element, item);
	},

	select: function(options){

		this.options = this.__checkOptions(options, this.selectDefault);
		var element = $('<div class="ele_build_selector"><select class="ele_build_simple_selector"></select></div>');
		var item = $('<option></option>');

		return this.__makeElement(this.options, 'select', element, item);
	},

	block: function(options){

		this.options = this.__checkOptions(options, this.blockDefault);

		var element = $('<div class="ele_build_block"><div class="block_header"><div class="ele_build_row"></div></div><div class="block_contents_title"><span class="ele_build_label">约束</span></div><div class="block_contents"></div></div>'),
		 	spotTpl = $('<span><input type="text" class="ele_build_input" /><input type="checkbox" /><label></label></span>'),
			optionTpl = $('<div class="ele_build_col_6"><span class="ele_build_label"></span><span class="ele_build_elements"><input type="text" class="ele_build_input"></span></div>'); 
		 	containerTpl = $('<div class="ele_build_block_container"><div class="e_l_s_contents"></div></div>'),
		 	spotPositionList = {
				 left: 'block_spot_x_f', 
				 verticalCenter: 'block_spot_x_s', 
				 right: 'block_spot_x_t', 
				 top: 'block_spot_y_f', 
				 horizontalCenter: 'block_spot_y_s', 
				 bottom: 'block_spot_y_t'
			},
			headerOptionList = {
				height: 'height', 
				width: 'width', 
				x: 'x', 
				y: 'y'
			},
			id = 'element-block-'+this.generateRandom();

		var	spotStatusMap = [],
		 	blockContents = element.find('.block_contents'),
		 	blockHeader = element.find('.ele_build_row');

		for(var i in headerOptionList)
		{
			var header = headerOptionList[i];
			var newHeaderTpl = optionTpl.clone();

			newHeaderTpl.find('input[type=text]').attr('name', i);
			newHeaderTpl.find('.ele_build_label').text(header + '：');

			blockHeader.append(newHeaderTpl);
		}

		for(var i in spotPositionList)
		{
			var spotPosition = spotPositionList[i];
			var newSpotTpl = spotTpl.clone();

			spotStatusMap[spotPosition] = false;

			newSpotTpl.addClass(spotPosition);
			newSpotTpl.find('input[type=text]').attr('name', i);
			newSpotTpl.find('label').addClass('block_line_' + spotPosition.substring(11, 12));

			blockContents.append(newSpotTpl);
		}

		element.attr('id', id);
		blockContents.append(containerTpl);

		this.element.append(element);

		// Bind
		this.element.on('click', '#'+id+' input[type=checkbox]', function()
		{
			var _this = $(this);
			var spotClassName = _this.parent().attr('class');
			var containerContentElement = containerTpl.find('.e_l_s_contents');
			

			if(_this.is(':checked')){
				_this.siblings('input[type=text]').css('display', 'block');
				spotStatusMap[spotClassName] = true;
			}else{
				_this.siblings('input[type=text]').removeAttr('style');
				spotStatusMap[spotClassName] = false;
			}

			var spotSiblings = {
				horizontal: 'block_spot_x_f,block_spot_x_t', 
				vertical: 'block_spot_y_f,block_spot_y_t'
			};
			for(var i in spotSiblings)
			{
				var spotSibling = spotSiblings[i];
				var spotSiblingArray = spotSibling.split(',');
				
				if(spotStatusMap[spotSiblingArray[0]] && spotStatusMap[spotSiblingArray[1]])
				{
					i == 'horizontal' ? containerContentElement.css({left: '25%', right: '25%'}) :
						containerContentElement.css({top: '25%', bottom: '25%'});
				}
				else
				{
					i == 'horizontal' ? containerContentElement.css({left: '35%', right: '35%'}) : 
						containerContentElement.css({top: '45%', bottom: '45%'});
				}
			}
		});

		// Return
		var data = {
			left: null,
			right: null,
			top: null,
			bottom: null,
			horizontalCenter: null,
			verticalCenter: null,
			width: null,
			height: null,
			x: null,
			y: null
		};

		var onchange = typeof this.options.onchange != 'undefined' ? this.options.onchange : '';

		this.element.on('blur', '#'+id+' input[type=text]', function(){
			var _this = $(this);
			var _name = _this.attr('name');

			if(typeof data[_name] != 'undefined')
			{
				data[_name] = _this.val();
			}

			typeof onchange == 'function' ? onchange(data) : eval(onchange);
		});
		return element;
	},

	imageCut: function(options){

		this.options = this.__checkOptions(options, this.imageCutDefault);

		var element = $('<div class="ele_build_cut"><div class="cut_container"><img src="" /></div><div class="cut_spot"><div class="ele_build_row"></div></div></div>');
		var spotTpl = $('<div class="ele_build_col_3"><span class="ele_build_label"></span><span class="ele_build_elements"><input type="text" class="ele_build_input"></span></div>');
		var imageElement = element.find('img'),
		 	spotElement = element.find('.cut_spot .ele_build_row'),
		 	spotList = ['L', 'T', 'R', 'B'],
			scaling = 1,
			id = 'element-image-cut-' + this.generateRandom();

		element.attr('id', id);

		for(var i in spotList)
		{
			var spot = spotList[i];
			var cloneSpot = spotTpl.clone();

			cloneSpot.find('.ele_build_label').text(spot+'：');
			cloneSpot.find('.ele_build_elements').css('left', 20);
			cloneSpot.find('input[type=text]').attr('name', spot);

			spotElement.append(cloneSpot);
		}

		if(typeof this.options.imageUrl == 'string')
		{
			imageElement.attr('src', this.options.imageUrl);
		}

		this.element.append(element);
		var onchange = typeof this.options.onchange != 'undefined' ? this.options.onchange : '';

		var showCoords = function(c){
			var realSize = cropApi.getBounds();

			var left = Math.round(c.x),
				top = Math.round(c.y),
				right = Math.round(realSize[0] - c.w - c.x),
				bottom = Math.round(realSize[1] - c.h - c.y);
			
			spotElement.find('input[name=L]').val(left);
			spotElement.find('input[name=T]').val(top);
			spotElement.find('input[name=R]').val(right);
			spotElement.find('input[name=B]').val(bottom);

			typeof onchange == 'function' ? onchange({left: left, top: top, right: right, bottom: bottom}) : eval(onchange);
		};

		var clearCoords = function(){
			spotElement.find('input').val('');
		};

		imageElement.Jcrop({
			boxWidth: Math.round(this.element.width()),
			onChange: showCoords,
			onSelect: showCoords,
			onRelease: clearCoords
		}, function(){
			cropApi = this;
		});

		// Bind
		this.element.on('change', 'input[type=text]', function(){
			var realSize = cropApi.getBounds();

			var left = spotElement.find('input[name=L]').val(),
				top = spotElement.find('input[name=T]').val(),
				right = spotElement.find('input[name=R]').val(),
				bottom = spotElement.find('input[name=B]').val();

			cropApi.setSelect([left, top, (realSize[0]-right), (realSize[1]-bottom)]);
		});
		return element;
	},

	chosen: function(options){

		this.options = this.__checkOptions(options, this.chosenDefault);

		var element = $('<select class="ele_build_chosen"></select>');

		return this.__makeElement(this.options, 'chosen', element);
	},

	drag: function(options){

		this.options = this.__checkOptions(options, this.dragDefault);
		var element = $('<div class="ele_build_drag_container"><div class="ele_build_drag_bar"><i class=""></i><input type="text" class="ele_build_input" disabled ></div><div class="ele_build_drag_chosen"></div></div>');
		this.__makeElement(this.options, 'drag', element);

		var chosenElement = $('<select class="ele_build_chosen"></select>');
		var chosenOptions = this.__checkOptions(this.options.chosen, this.chosenDefault);
		chosenOptions.value = ' ';

		chosenOptions.drag = element.find('input');
		chosenOptions.dragData = this.options.data;

		this.element = element.find('.ele_build_drag_chosen');
		return this.__makeElement(chosenOptions, 'chosen', chosenElement);
	}

};

$.fn.elementBuilder = function(){
	return new EleBuilder(this)
}
