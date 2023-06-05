var combined = null;
var combined_shift = null;
var publisher = null;





// global variables for hyperparameter visualizations
var par_lrs = [0.01, 0.1, 1.0, 10.0];
var par_amps = [1, 10, 100];
var par_ratios = [0.05, 0.2, 0.4, 0.6, 0.8, 0.95];

var par_lr = par_lrs[Math.floor(par_lrs.length/2)];
var par_amp = par_amps[Math.floor(par_amps.length/2)];
var par_ratio = par_ratios[Math.floor(par_ratios.length/2)];

var orig_canv_id = 'par_orig';
var opt_canv_id = 'par_opt';
var range_slider_ratio = 'par_ratio';
var range_slider_lr = 'par_lr';
var range_slider_amp = 'par_amp';

var range_path = 'param_visu';
var orig_img_id = '0'

var slider1 = null;
var slider2 = null;
var slider3 = null;




// set up all visualizations at page initialization
document.addEventListener("DOMContentLoaded", function(event) {
	
	

 // old



  combined = new combined_visu('#bbs','out_bb','3','13',null,'');
  combined_shift = new combined_visu('#shift','out_shift','3','13',10,'_2');




opt_loc = new combined_visu_simple('#optloc','opt_loc/zebra');


var range_canv_id = 'opt_height';
var range_slider_id = 'height_slide';


var range_path = 'opt_height/exp3/person';

var slider = document.getElementById(range_slider_id);

quadratic_canv('#'+range_canv_id);

change_canv_img('#'+range_canv_id,'gfx/instruction2.jpg', 416);

slider.oninput = function(){
	var img_path = 'figs/'+range_path+'/'+pad(this.value,2)+'.jpg';

	change_canv_img('#'+range_canv_id,img_path, 416);
	
	};









	
	// new
	
	
	
	init_param_visu();


	quadratic_canv('#or_im');
	quadratic_canv('#opt_im');

var ul=document.getElementById('img_select');

var max_i = 16;

for (var ti=0;ti<=max_i;++ti){
    var li=document.createElement('li');
    ul.appendChild(li);
    var img=document.createElement('img');

    img.src="figs/optim_visu/"+ti+"_thumb.jpg";
    img.id="opt_img_"+ti;
    img.class="opt_img";
    img.optid = ti;
    li.appendChild(img);
    img.addEventListener('click', function (e) {
    	change_optimgs(this.optid);
    });
  }

	change_optimgs(0);


	document.getElementById('or_bb').oninput = function() {change_optimgs(null);};
	document.getElementById('opt_bb').oninput = function() {change_optimgs(null);};


















});

var img_selected = 0;

function  change_optimgs (optid) {
	if(optid == null) optid = img_selected;
	if(document.getElementById('or_bb').checked) {
		change_canv_img('#or_im', 'figs/optim_visu/'+optid+'_orbb.jpg', 640);
	} else {
		change_canv_img('#or_im', 'figs/optim_visu/'+optid+'_original.jpg', 640);
	}
	if(document.getElementById('opt_bb').checked) {
		change_canv_img('#opt_im', 'figs/optim_visu/'+optid+'_opbb.jpg', 640);
	} else {
		change_canv_img('#opt_im', 'figs/optim_visu/'+optid+'_optim.jpg', 640);
	}
	img_selected = optid;
}


function init_param_visu(){
	
	quadratic_canv('#'+orig_canv_id);
	quadratic_canv('#'+opt_canv_id);

	change_canv_img('#'+orig_canv_id, 'figs/'+range_path+'/original_'+orig_img_id+'.jpg', 640);

	slratio = document.getElementById(range_slider_ratio);
	sllr = document.getElementById(range_slider_lr);
	slamp = document.getElementById(range_slider_amp);
	
	slratio.min = 0;
	slratio.max = par_ratios.length -1;
	slratio.value = Math.floor(par_ratios.length/2)
	sllr.min = 0;
	sllr.max = par_lrs.length -1;
	sllr.value = Math.floor(sllr.length/2)
	slamp.min = 0;
	slamp.max = par_amps.length -1;
	slamp.value = Math.floor(slamp.length/2)

	document.getElementById("par_ratio_val").innerHTML = par_ratios[slratio.value];
	document.getElementById("par_lr_val").innerHTML = par_lrs[sllr.value];
	document.getElementById("par_amp_val").innerHTML = par_amps[slamp.value];
	update_slider_img();

	slratio.oninput = function(){
		par_ratio = par_ratios[this.value];
		update_slider_img();
		document.getElementById("par_ratio_val").innerHTML = par_ratio;
		};
	sllr.oninput = function(){
		par_lr = par_lrs[this.value];
		update_slider_img();
		document.getElementById("par_lr_val").innerHTML = par_lr;
		};
	slamp.oninput = function(){
		par_amp = par_amps[this.value];
		update_slider_img();
		document.getElementById("par_amp_val").innerHTML = par_amp;
		};
	
	
	}


function update_slider_img() {
	var par_rati = 1-par_ratio;
	var img_path = 'figs/'+range_path+'/plain_'+orig_img_id+"_"+par_ratio.toFixed(6)+"_"+par_rati.toFixed(6)+"_"+par_lr.toFixed(6)+"_"+par_amp+'.jpg';
	change_canv_img('#'+opt_canv_id,img_path, 416);
}



class combined_visu_simple {
	constructor(canv_id, root_dir) {
		this.canvas = $(canv_id);
		this.canv_id = canv_id;
		this.root_dir = root_dir;
		quadratic_canv(canv_id);
		change_canv_img(this.canv_id, 'gfx/instruction.jpg', 416)

		 
		 this.canvas[0].addEventListener('mousemove', e => {
			var mouse = get_mouse_xy(this.canvas[0],e);
			var grid_pos = [(mouse[0]/this.canvas.width()),(mouse[1]/this.canvas.height())];
			this.update_image(grid_pos);
		}, true);


	  this.canvas[0].addEventListener('mouseout', e => {
	  	change_canv_img(this.canv_id, 'gfx/instruction.jpg', 416)
	  }, true);

		}

	update_image(grid_pos) {
		var num = 13;
        var gy = Math.floor(grid_pos[0]*num);
        var gx = Math.floor(grid_pos[1]*num);
        var file_name = 'figs/'+this.root_dir+'/'+pad(gx,2)+'_'+pad(gy,2)+'.jpg';
        change_canv_img(this.canv_id,file_name, 416);

	}

    init() {
        
    }

}







// combined visualization (image select, size select, combined canvas for hovering and visualization)
class combined_visu {
	constructor(canv_id, root_dir,base_img, size_bb,num_imgs,name_suffix) {
		this.canvas = $(canv_id);
		this.canv_id = canv_id;
		this.base_img = base_img;
		this.size_bb = size_bb;
		this.root_dir = root_dir;
		this.num_imgs = num_imgs;
		this.name_suffix = name_suffix;
		quadratic_canv(canv_id);
		change_canv_img(this.canv_id, 'gfx/instruction.jpg', 416)

		 
		 this.canvas[0].addEventListener('mousemove', e => {
			var mouse = get_mouse_xy(this.canvas[0],e);
			var grid_pos = [(mouse[0]/this.canvas.width()),(mouse[1]/this.canvas.height())];
			this.update_image(grid_pos);
		}, true);


	  this.canvas[0].addEventListener('mouseout', e => {
	  	change_canv_img(this.canv_id, 'gfx/instruction.jpg', 416)
	  }, true);

        this.change_image(base_img);
        this.change_size(size_bb);
		 
		}

	update_image(grid_pos) {
		var num = this.num_imgs ? this.num_imgs : parseInt(this.size_bb);
        var gx = Math.floor(grid_pos[0]*num);
        var gy = Math.floor(grid_pos[1]*num);
        var file_name = 'figs/'+this.root_dir+'/'+this.base_img+'/'+this.size_bb+'/img_'+pad(gx,5)+'_'+pad(gy,5)+'.jpg';
        change_canv_img(this.canv_id,file_name, 416);

	}

    init() {
        
    }

    set_num_imgs(num_imgs) {
    	this.num_imgs = num_imgs;
    }

    set_name_suffix(suffix) {
    	this.name_suffix = suffix;
    }

    change_size(new_size){
    	this.size_bb = new_size;
    	this.init();
			
        var all = document.getElementsByClassName('size_select_img'+this.name_suffix);
		for (var i = 0; i < all.length; i++) {
		  all[i].style.border = '';
		}
        document.getElementById('ss_'+new_size+this.name_suffix).style.cssText = 'border-bottom: 5px solid black';
    }
    change_image(new_img){
    	this.base_img = new_img;
    	this.init();
		
        var all = document.getElementsByClassName('fig_select_img'+this.name_suffix);
		for (var i = 0; i < all.length; i++) {
		  all[i].style.border = '';
		}
        document.getElementById('fs_'+new_img+this.name_suffix).style.cssText = 'border-bottom: 5px solid black';
    }


}


















// publisher class for updating subscriber based on mouse hovering events
class img_publisher {
	constructor(canv_id) {
		this.subscriber = [];
		this.canvas = $(canv_id);
		this.canv_id = canv_id;
		
		 quadratic_canv(canv_id);
		 change_canv_img(this.canv_id, 'gfx/instruction.jpg', 416)

		 
		 this.canvas[0].addEventListener('mousemove', e => {
			var mouse = get_mouse_xy(this.canvas[0],e);
			var grid_pos = [(mouse[0]/this.canvas.width()),(mouse[1]/this.canvas.height())];
			this.update_subscriber(grid_pos);
		}, true);


	  this.canvas[0].addEventListener('mouseout', e => {
	  	change_canv_img(this.canv_id, 'gfx/instruction.jpg', 416)
	  }, true);

		 
		}

	register_subscriber(subscriber) {
		this.subscriber.push(subscriber);
	}

	update_subscriber(grid_pos) {
		for(var i=0;i<this.subscriber.length;++i) {
			this.subscriber[i].update(grid_pos);
		}
	}
}

// subscriber class for updating canvas based on published events
class img_subscriber {
	constructor(canv_id, img_path){
		this.canv_id = canv_id;
		this.img_path = img_path;

		quadratic_canv(canv_id);


	}
	
	update(grid_pos) {
		var start_i = 2;
		var num = 9;
        var gx = Math.floor(grid_pos[0]*num+start_i);
        var gy = Math.floor(grid_pos[1]*num+start_i);
        var file_name = this.img_path+'/img_'+pad(gx,5)+'_'+pad(gy,5)+'.jpg';
        change_canv_img(this.canv_id,file_name, 416);

	}
}













//
// helper functions
//


//make canvas squared (take width as reference)
function quadratic_canv(canv) {
	canv = $(canv);
    s = canv.width();
	canv.css('width',s);
	canv.css('height',s);
    canv[0].width = s;
    canv[0].height = s;
}

//change canvas image
function change_canv_img(canv, img, csize) {
	canv = $(canv);

	var context = canv[0].getContext('2d');

	base_img_file = new Image;
	base_img_file.src = img;
	base_img_file.onload = function() {
		context.drawImage(this, 0,0, csize, csize,0,0,canv[0].width,canv[0].height);
	};

}


// padding numbers with trailing 0's
function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
// padding numbers with appending 0's
function pada(num, size) {
    var s = num+"";
    while (s.length < size) s =  s+"0";
    return s;
}

// get mouse position on any canvas by canvas and mouse event
function get_mouse_xy(c, e) {
  var element = c, offsetX = 0, offsetY = 0, mx, my;
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }
  mx = e.pageX - offsetX;
  my = e.pageY - offsetY;

  //add scroll position on top
  //mx = mx + $('#canvas_container').scrollLeft();

  return [mx,my];
}

