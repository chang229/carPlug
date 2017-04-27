// 父容器：count:idname
// 变化的容器：sild:idname
// 按钮：btn:[idname]
// 小圆点：dot:boolean
// 小圆点位置：dotPosit:string

// 封装document.getElementById方法
function $(id) {
	return document.getElementById(id);
};
// 小圆点业务封装
function getDot(count,number,posit) {
	var ol = document.createElement("ol");
	ol.id = "dotOl";
	for (var j = 0; j < number; j++) {
		var li = document.createElement("li");
		ol.appendChild(li);
	};
	count.appendChild(ol);
	var olWidth = ol.offsetWidth;
	switch (posit) {
		case "left":
			ol.style.left = "5px";
			break;
		case "center":
			ol.style.left = "50%";
			ol.style.marginLeft = -olWidth / 2 + "px";
			break;
		case "right":
			ol.style.right = "5px";
	};
}
// 淡入淡出轮播
function fadeUp(obj) {
	// 初始化样式
	var demo = $(obj.count);
	var fadeUl = $(obj.sild);
	var lis = fadeUl.children;
	lis[0].style.opacity = 1;
	// 小圆点
	if (obj.dot) {
		getDot(demo,lis.length,obj.fadePosit);
		var ol = $("dotOl");
		var olLis = ol.children;
		olLis[0].className = "current";
		// 小圆点点击事件
		for (var j = 0; j < olLis.length; j++) {
			olLis[j].index = j;
			olLis[j].onclick = function() {
				if (onOff) {
					onOff = false;
					var s = this.index;
					index = s;
					common();
				};
			};
		};
	};
	// 获取按钮
	if (obj.btn) {
		var lbtn = $(obj.btn[0]);
		var rbtn = $(obj.btn[1]);
		// 按钮点击事件
		var onOff = true;
		lbtn.onclick = function() {
			if (onOff) {
				onOff = false;
				lclick();
			}
		};
		rbtn.onclick = function() {
			if (onOff) {
				onOff = false;
				rclick();
			}
		};
	};
	// 大盒子的hover事件
	demo.onmouseover = function() {
		clearInterval(timer);
		if (obj.btn) {
			animate(lbtn, {
				"opacity": 1
			});
			animate(rbtn, {
				"opacity": 1
			});
		};
	};
	demo.onmouseout = function() {
		timer = setInterval(rclick, 3000);
		if (obj.btn) {
			animate(lbtn, {
				"opacity": 0
			});
			animate(rbtn, {
				"opacity": 0
			});
		};
	};
	// 自动切换
	var index = 0,
		timer = null;
	timer = setInterval(rclick, 3000);
	// 右侧点击事件
	function rclick() {
		index++;
		if (index > lis.length - 1) {
			index = 0;
		};
		common();
	};

	function lclick() {
		index--;
		if (index < 0) {
			index = lis.length - 1;
		};
		common();
	}

	function common() {
		for (var i = 0; i < lis.length; i++) {
			animate(lis[i], {
				"opacity": 0
			});
		};
		animate(lis[index], {
			"opacity": 1
		}, function() {
			onOff = true
		});
		if (obj.dot) {
			for (var k = 0; k < lis.length; k++) {
				olLis[k].className = "";
			};
			olLis[index].className = "current";
		};
	};
};
// pc滑动轮播
function sliderUp(obj) {
	var demo = $(obj.count);
	var demoWidth = demo.clientWidth;
	// 滑动的元素
	var slid = $(obj.slid);
	// 初始化样式
	var firstLi = slid.children[0].cloneNode(true);
	slid.appendChild(firstLi);
	var lis = slid.children;
	slid.style.width = lis.length * 100 + "%";
	for (var i = 0; i < lis.length; i++) {
		lis[i].style.width = 100 / lis.length + "%";
	};
	if (obj.dot) {
		getDot(demo,lis.length-1,obj.slidePosit);
		var ol = $("dotOl");
		var olLis = ol.children;
		olLis[0].className = "current";
		// 点击下标事件
		for (var j = 0; j < olLis.length; j++) {
			olLis[j].index = j;
			olLis[j].onclick = function() {
				if (onOff) {
					onOff = false;
					animate(slid, {
						"left": -this.index * demoWidth
					}, function() {
						onOff = true;
					});
					index = this.index;
					s = this.index;
					current();
				};
			};
		};
	};
	// 获取按钮
	// 按钮点击事件
	var onOff = true;
	if (obj.btn) {
		var lbtn = $(obj.btn[0]);
		var rbtn = $(obj.btn[1]);
		// 右按钮
		rbtn.onclick = function() {
			if (onOff) {
				onOff = false;
				rclick();
			};
		};
		// 左按钮
		lbtn.onclick = function() {
			if (onOff) {
				onOff = false;
				lclick();
			};
		};
	};
	// 大盒子hover事件
	demo.onmouseover = function() {
		clearInterval(timer);
		if (obj.btn) {
			animate(lbtn, {
				"opacity": 1
			});
			animate(rbtn, {
				"opacity": 1
			});
		};
	};
	demo.onmouseout = function() {
		timer = setInterval(rclick, 3000);
		if (obj.btn) {
			animate(lbtn, {
				"opacity": 0
			});
			animate(rbtn, {
				"opacity": 0
			});
		};
	};
	// 自动轮播
	var timer = null;
	var index = 0,
		s = 0;
	timer = setInterval(rclick, 3000);

	function lclick() {
		if (index == 0) {
			index = lis.length - 1;
			slid.style.left = -(lis.length - 1) * demoWidth + "px";
		};
		index--;
		animate(slid, {
			"left": -index * demoWidth
		}, function() {
			onOff = true;
		});
		if (obj.dot) {
			if (s == 0) {
				s = lis.length - 2;
			} else {
				s--;
			};
			current();
		};
	};

	function rclick() {
		if (index == lis.length - 1) {
			index = 0;
			slid.style.left = 0;
		};
		index++;
		animate(slid, {
			"left": -index * demoWidth
		}, function() {
			onOff = true;
		});
		if (obj.dot) {
			if (s == lis.length - 2) {
				s = 0;
			} else {
				s++;
			};
			current();
		};
	};
	// 为li添加当前样式
	function current() {
		for (var j = 0; j < olLis.length; j++) {
			olLis[j].className = "";
		};
		olLis[s].className = "current";
	};
};
// 移动端滑动轮播方法
function touchUp(obj) {
	// 获取对象
	var touchCount = $(obj.count);
	var touchSlid = $(obj.slid);
	var lis = touchSlid.children;
	// 获取touchCount的宽度
	var demoWidth = touchCount.clientWidth;
	// 初始化样式
	var firstLi = lis[0].cloneNode(true);
	var lastLi = lis[lis.length - 1].cloneNode(true);
	touchSlid.appendChild(firstLi);
	touchSlid.insertBefore(lastLi, lis[0]);
	lis = touchSlid.children;
	touchSlid.style.width = lis.length * 100 + "%";
	touchSlid.style.left = -demoWidth + "px";
	for (var i = 0; i < lis.length; i++) {
		lis[i].style.width = 100 / lis.length + "%";
	};
	// 小圆点
	if (obj.dot) {
		getDot(demo,lis.length-2,obj.touchPosit);
	};
	var ol = $("dotOl");
	var olLis = ol.children;
	olLis[0].className = "current";
	// 自动轮播
	var index = 0,
		s = 0,
		timer = null,
		ulLeft = -demoWidth;
	timer = setInterval(rclick, 3000);
	// touch事件
	var startX, moveX, endX, step = 0;
	touchSlid.addEventListener("touchstart", function(e) {
		clearInterval(timer);
		startX = e.touches[0].clientX;
	}, false);
	touchSlid.addEventListener("touchmove", function(e) {
		moveX = e.touches[0].clientX;
		step = moveX - startX;
		touchSlid.style.left = ulLeft + step + "px";
	}, false);
	touchSlid.addEventListener("touchend", function(e) {
		endX = e.changedTouches[0].clientX;
		var diffX = Math.abs(endX - startX);
		if (diffX < demoWidth / 3) {
			animate(touchSlid, {
				"left": ulLeft
			});
		} else {
			if (endX < startX) {
				rclick();
			};
			if (endX > startX) {
				lclick();
			};
		};
		timer = setInterval(rclick, 3000);
	}, false);
	// 向右轮播
	function rclick() {
		if (index >= lis.length - 2) {
			index = 0;
			touchSlid.style.left = -demoWidth + "px";
			ulLeft = -(index + 1) * demoWidth;
		};
		index++;
		ulLeft = -(index + 1) * demoWidth;
		animate(touchSlid, {
			"left": -(index + 1) * demoWidth
		}, function() {
			if (index >= lis.length - 2) {
				index = 0;
				touchSlid.style.left = -demoWidth + "px";
				ulLeft = -(index + 1) * demoWidth;
			};
		});
		if (obj.dot) {
			if (s == olLis.length - 1) {
				s = 0;
			} else {
				s++;
			};
			current();
		};
	};
	// 向左轮播
	function lclick() {
		index--;
		ulLeft = -(index + 1) * demoWidth;
		animate(touchSlid, {
			"left": -(index + 1) * demoWidth
		}, function() {
			if (index == -1) {
				index = lis.length - 3;
				touchSlid.style.left = -(lis.length - 2) * demoWidth + "px";
				ulLeft = -(index + 1) * demoWidth;
			};
		});
		if (obj.dot) {
			if (s == 0) {
				s = olLis.length - 1;
			} else {
				s--;
			};
			current();
		};
	};
	// 小圆点当前样式
	function current() {
		for (i = 0; i < olLis.length; i++) {
			olLis[i].className = "";
		};
		olLis[s].className = "current";
	};
};
// 获取当前样式
function getStyle(ele, attr) {
	if (window.getComputedStyle) {
		return window.getComputedStyle(ele, null)[attr];
	} else {
		return ele.currentStyle[attr];
	};
};
// 缓动动画函数
function animate(ele, obj, fn) {
	clearInterval(ele.timer);
	ele.timer = setInterval(function() {
		var flog = true;
		for (var k in obj) {
			if (k == "zIndex") {
				ele.style[k] = obj[k];
			} else if (k == "opacity") {
				var target = obj[k] * 100;
				var leader = getStyle(ele, k) * 100;
				var step = (target - leader) / 10;
				step = step > 0 ? Math.ceil(step) : Math.floor(step);
				leader = leader + step;
				ele.style[k] = leader / 100;
			} else {
				var target = obj[k];
				var leader = parseInt(getStyle(ele, k));
				var step = (target - leader) / 10;
				step = step > 0 ? Math.ceil(step) : Math.floor(step);
				leader = leader + step;
				ele.style[k] = leader + "px";
			};
			if (leader !== target) {
				flog = false;
			};
		};
		if (flog) {
			clearInterval(ele.timer);
			if (fn) {
				fn();
			};
		};
	}, 15);
};