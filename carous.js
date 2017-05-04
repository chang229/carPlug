// carous方法总和封装
// carous();
// 父容器（必填）count:id
// 滑动容器（必填）sild:id
// 是否开启自动轮播 autoPlay:boolean(true,false,默认true)
// 是否开启左右按钮（选填）Isbtn:boolean(false,true,默认false);
// 左右按钮（选填）btn:[id,id]
// 小圆点（选填）dot:boolean(false,true,默认true)
// 小圆点位置（选填）dotPosit:string(left,center,right,默认center)
// 轮播方向（选填）direct:string(left,top,默认left);
// 是否开启触摸（选填）touch:boolean(false,true,默认true);
// 轮播事件（选填）time:number(默认3000)
function carous(obj){
	// 设置默认值
	var defaults = {
		count:"#",
		sild:"#",
		autoPlay:true,
		Isbtn:false,
		btn:["#","#"],
		dot:true,
		dotPosit:"center",
		direct:"left",
		touch:true,
		time:3000
	};
	// 根据传入的参数修改默认值
	for(var k in obj){
		defaults[k] = obj[k];
	};
	// 获取对象
	var count = $(defaults.count);
	var sild = $(defaults.sild);
	// 获取count的宽度
	var countWidth = count.clientWidth;
	// 初始化样式
	// 判断是否开启touch事件
	var lis = sild.children;
	var lastLi = null;
	if(defaults.touch){
		lastLi = sild.children[lis.length-1].cloneNode(true);
	};
	var firstLi = lis[0].cloneNode(true);
	sild.appendChild(firstLi);
	if(lastLi){
		sild.insertBefore(lastLi, lis[0]);
	};
	lis = sild.children;
	var num = lis.length-1;
	sild.style.width = lis.length*100+"%";
	for(var i = 0 ; i < lis.length; i++){
		lis[i].style.width = 100/lis.length + "%";
	};
	if(defaults.touch){
		sild.style.left = -countWidth+"px";
		num = lis.length-2;
	};
	// 小圆点业务
	var olLis = null;
	if(defaults.dot){
		getDot(count,num,defaults.dotPosit);
		olLis = $("dotOl").children;
		olLis[0].className = "current";
	};
	// 自动轮播
	var timer = null,index = 0,s = 0;
	if (defaults.autoPlay) {
		timer = setInterval(rclick, defaults.time);
	};
	// 是否开启两侧按钮
	var lbtn=null,rbtn=null;
	var onOff = true;
	if(defaults.Isbtn){
		lbtn = $(defaults.btn[0]);
		rbtn = $(defaults.btn[1]);
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
	// 点击下标事件
	if (!defaults.touch) {
		for (var j = 0; j < olLis.length; j++) {
			olLis[j].index = j;
			olLis[j].onclick = function() {
				if (onOff) {
					onOff = false;
					animate(sild, {
						"left": -this.index * countWidth
					}, function() {
						onOff = true;
					});
					index = this.index;
					s = this.index;
					current();
				};
			};
		};
		if (defaults.autoPlay) {
			// 大盒子hover事件
			count.onmouseover = function() {
				clearInterval(timer);
				if (defaults.btn) {
					animate(lbtn, {
						"opacity": 1
					});
					animate(rbtn, {
						"opacity": 1
					});
				};
			};
			count.onmouseout = function() {
				timer = setInterval(rclick, 3000);
				if (defaults.btn) {
					animate(lbtn, {
						"opacity": 0
					});
					animate(rbtn, {
						"opacity": 0
					});
				};
			};
		};
	};
	// 是否开启手机滑动
	var startX, moveX, endX, step = 0,ulLeft = -countWidth;;
	if (defaults.touch) {
		sild.addEventListener("touchstart", function(e) {
			if (defaults.autoPlay) {
				clearInterval(timer);
			};
			startX = e.touches[0].clientX;
		}, false);
		sild.addEventListener("touchmove", function(e) {
			moveX = e.touches[0].clientX;
			step = moveX - startX;
			sild.style.left = ulLeft + step + "px";
		}, false);
		sild.addEventListener("touchend", function(e) {
			endX = e.changedTouches[0].clientX;
			var diffX = Math.abs(endX - startX);
			if (diffX < countWidth / 3) {
				animate(sild, {
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
			if (defaults.autoPlay) {
				timer = setInterval(rclick, 3000);
			};
		}, false);
	};
	function rclick() {
		if (defaults.touch) {
			if (index >= lis.length - 2) {
				index = 0;
				sild.style.left = -countWidth + "px";
				ulLeft = -(index + 1) * countWidth;
			}
		} else {
			if (index >= lis.length - 1) {
				index = 0;
				sild.style.left = 0;
			};
		};
		index++;
		if(defaults.touch){
			ulLeft = -(index + 1) * countWidth;
		};
		animate(sild, {
			"left": defaults.touch ? -(index + 1) * countWidth : -index * countWidth
		}, function() {
			onOff = true;
			if (defaults.touch) {
				if (index >= lis.length - 2) {
					index = 0;
					sild.style.left = -countWidth + "px";
					ulLeft = -(index + 1) * countWidth;
				};
			};
		});
		if (defaults.dot) {
			if (s >= olLis.length - 1) {
				s = 0;
			} else {
				s++;
			};
			current();
		};
	};
	function lclick() {
		if (!defaults.touch) {
			if (index <= 0) {
				index = lis.length - 1;
				sild.style.left = -(lis.length - 1) * countWidth + "px";
			};
		};
		index--;
		if(defaults.touch){
			ulLeft = -(index + 1) * countWidth;
		};
		animate(sild, {
			"left": defaults.touch ? -(index + 1) * countWidth : -index * countWidth
		}, function() {
			onOff = true;
			if (defaults.touch) {
				if (index == -1) {
					index = lis.length - 3;
					sild.style.left = -(lis.length - 2) * countWidth + "px";
					ulLeft = -(index + 1) * countWidth;
				};
			};
		});
		if (defaults.dot) {
			if (s <= 0) {
				s = olLis.length - 1;
			} else {
				s--;
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