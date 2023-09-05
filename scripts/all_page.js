var vh = 0,
	vw = 0;

class Theme_Controller {
	// TRON theme controller
	constructor() {
		this.fa_ok = false;
	}

	switch_init() {
		var that = this;
		this.switch_btn = byClass("tron-switch");

		for (var i = 0; i < this.switch_btn.length; i++) {
			let id = this.switch_btn[i].id;

			// fix initial state
			that.set_switch_mode(id, that.switch_mode(id));

			// set click action
			this.switch_btn[i].onclick = function () {
				that.set_switch_mode(id, that.switch_mode(id), true);
			};
		}
	}

	switch_mode(id) {
		let btn = byId(id + "-mode");
		if (btn.innerText == "ON") {
			return true;
		} else return false;
	}

	set_switch_mode(id, mode, not = false) {
		// not: do the inverse of current mode
		let btn = byId(id + "-mode");
		let parent = byId(id);

		function toggle_panel(disable) {
			let Guncle = parent.parentElement.nextElementSibling;
			if (tools.is_in(id, panel2disable)) {
				if (disable == true) {
					Guncle.classList.add("disabled");
					Guncle.disabled = true;
				} else {
					Guncle.classList.remove("disabled");
					Guncle.disabled = false;
				}
			}
		}
		if (not) {
			if (mode == "ON" || mode === true) {
				btn.innerText = "OFF";
				parent.classList.remove("active");
				{
					toggle_panel(true);
				}
			} else {
				btn.innerText = "ON";
				parent.classList.add("active");
				toggle_panel(false);
			}
		} else {
			if (mode == "ON" || mode === true) {
				btn.innerText = "ON";
				parent.classList.add("active");
				toggle_panel(false);
			} else {
				btn.innerText = "OFF";
				parent.classList.remove("active");
				toggle_panel(true);
			}
		}
	}

	getViewportSize() {
		// var vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
		// var vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

		// vh = byId("brightness").clientHeight;
		// vw = byId("brightness").clientWidth;

		vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
		vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

	}

	async del_fa_alt() {
		if (this.fa_ok) {
			document.querySelectorAll(".fa").forEach(e => e.parentNode.replaceChild(Object.assign(document.createElement("i"), { className: e.className, style: e.style }), e));
		}
	}

	async load_fa() {
		var that = this;
		let link = createElement('link');
		link.rel = "stylesheet";

		link.type = "text/css";
		link.media = 'print';
		// link.href = "https://cdn.jsdelivr.net/gh/hung1001/font-awesome-pro-v6@44659d9/css/all.min.css";
		link.href = "https://cdn.jsdelivr.net/gh/RaSan147/fabkp@2f5670e/css/all.min.css";
		link.onload = function () {
			log("fa loaded")
			that.fa_ok = true;
			that.del_fa_alt()
			link.media = "all";



			// var fa = byClass("fa")
			// for (var i=0;i<fa.length;i++){
			// 	fa[i].tagName = "i"
			// }
		}
		document.head.appendChild(link);
	}
}

var theme_controller = new Theme_Controller();

theme_controller.getViewportSize();
theme_controller.load_fa()
	










class Top_Bar {
	constructor() {
		this.dont_move = false;
		this.prevScrollpos = window.pageYOffset;
		this.top_bar = byId("TopBar");
		this.app_name = byId("app_name");
		this.profile_pic = byId("profile_pic");
	}

	set_title(title) {
		// if (vw < 300) {
		// 	this.app_name.innerHTML = " WL";
		// } else {
		// 	this.app_name.innerHTML = "WL Reader";
		// }
		this.app_name.innerText = title;
	}

	set_profile_pic(url) {
		this.profile_pic.src = url;
	}
	show() {
		this.top_bar.style.top = "0";
		document.body.style.top = "50px";
		this.top_bar.classList.remove("inactive");
	}

	hide() {
		this.top_bar.style.top = "-50px";
		document.body.style.top = "0";
	}

}

var top_bar = new Top_Bar();
top_bar.show();




window.onscroll = function () {


	// if(pages.current_page=="chat") return false;
	var currentScrollPos = window.pageYOffset;

	if (top_bar.dont_move) {
		return false;
	}

	if (top_bar.prevScrollpos > currentScrollPos+3) {
		top_bar.show();
	}
	if (top_bar.prevScrollpos < currentScrollPos-3) {
		top_bar.hide();
	}
	top_bar.prevScrollpos = currentScrollPos;
};

var clientX, clientY;
window.addEventListener('touchstart', (e) => {
	// Cache the client X/Y coordinates
	clientX = e.touches[0].clientX;
	clientY = e.touches[0].clientY;
  }, false);
  
window.addEventListener('touchend', (e) => {
	let deltaX;
	let deltaY;

	
	// if(appConfig.page_type=="chat") return false;
  
	// Compute the change in X and Y coordinates.
	// The first touch point in the changedTouches
	// list is the touch point that was just removed from the surface.
	deltaX = e.changedTouches[0].clientX - clientX;
	deltaY = e.changedTouches[0].clientY - clientY;
  
	// Process the data…
	if (deltaY > 50) {
		top_bar.show();
	}
  }, false);

  { // why bracket? To make is isolated, coz I don't want variable names conflict with these mini functions or things
	const resizer = () => {
		theme_controller.getViewportSize();
		document.body.style.minHeight = vh + "px";
	}
	
	window.addEventListener("resize", (_e) => resizer());
	
	document.addEventListener("DOMContentLoaded", (_e) => resizer());
	}
    

class SidebarControl {
	constructor() {
		this.right_bar = byId("mySidebarR");
		this.sidebar_bg = byId("sidebar_bg");
		
		this.sidebar_bg.onclick = function () {
			sidebar_control.closeNav();
		};


	}



	is_open(side) {
		return tools.hasClass(
			byId("mySidebar" + side),
			"mySidebar-active",
			true
		);
	}
	
	openNavR() {
		tools.fake_push()

		tools.toggle_scroll(0);
		this.sidebar_bg.style.display = "block";
		this.right_bar.classList.add("mySidebar-active");
		this.right_bar.classList.remove("mySidebar-inactive");
		// byId("app_header").classList.toggle("top-titleR-active");
	}

	toggleNavR() {
		if (this.is_open("R")) {
			this.closeNavR();
			return;
		}
		
		this.openNavR()
	}
	
	_closeNavR(){
		this.right_bar.classList.remove("mySidebar-active");
		this.right_bar.classList.add("mySidebar-inactive");

		this.sidebar_bg.style.display = "none";

		tools.sleep(3000);
		tools.toggle_scroll(1);

		top_bar.dont_move = false; // allow moving the top bar
	}


	closeNavR() {
		if (this.is_open("R")) {
			HISTORY_ACTION = this._closeNavR.bind(this)
			history.back();
		}
	}

	closeNav() {
		this.closeNavR();
	}
}

var sidebar_control = new SidebarControl()


