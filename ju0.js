function time() {
	var r = [], d = new Date();
	function p(v, l, s) {
		v = v.toString();
		r.push(sNc("0", l - ln(v)) + v);
		if(s) r.push(s);
	}
	p(d.getDate(), 2, '.');
	p(d.getMonth() + 1, 2, '.');
	p(d.getFullYear(), 4, ' ');
	p(d.getHours(), 2, ':');
	p(d.getMinutes(), 2, ':');
	p(d.getSeconds(), 2, ':');
	p(d.getMilliseconds(), 3);
	return r.join("");
}

function oa(s) {
	return s ? " " + s : "";
}

function fixRN(s) {
	return s ? s.replace( /\r?\n/g, "\n" ) : s;
}

function http(u, b, f) {
	if(!ln(u) || !f) return false;
	b = fixRN(b);
	var q = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
	q.onreadystatechange = function() {
		if(q.readyState == 4) {
			var t = q.responseText, s = q.status;
			f(s == 200 ? t : s + ": " + t, s);
		}
	};
	q.open(b != null ? "POST" : "GET", u, true);
	try {
		q.send(b);
	} catch(e) {
		f(e, -1);
	}
}

function upload(n, b, f) {
	if(!ln(n) || !ln(b) || !f) return false;
	b = fixRN(b);
	var c = 512, p = 0, l = ln(b);
	function w() {
		var q = "/fSave?name=" + uri(n) + "&pos=" + p, d = p + c;
		if(d >= l) q += "&flush=1", d = l;
		return http(q, b.substring(p, d), function(re, s) {
			if(s == 200) {
				p = d;
				p < l ? w() : f(true);
			} else confirm("Error when uploading " + n + ": " + re + ". Try again?") ? w() : f(false);
		});
	};
	w();
}

dc = document;
function hT(v,t,a) {return "<"+ t + oa(a || null) + (v ? ">" + v + "</" + t + ">" : "/>");}
function hO(v,a) {return hT(v, "option", a || null) + "\n";}
function hA(n,v) {return (v != null ? ' ' + n + '="' + v + '"' : '');}
function hB(v) {return hT(v, "b");}
function hTd(v, a) {return hT(v, "td", a);}
function hTr(v, a) {return hT(v, "tr", a) + "\n";}
function hInput(t,i,n,v,a){return hT(null, 'input', hA('type', t) + hA('id', i) + hA('name', n) + hA('value', v) + oa(a || null));}
function hRadio(l,v,i,n,s,c) {return hInput('radio', i, n, v, hA('onclick', c) + hA('checked', (s?"checked":null))) + hT(l, "label", 'for="' + i + '"');}
function hInputH(i,n,v,a) {return hInput("hidden",i,n,v,a);}
function hInputB(i,n,v,a) {return hInput("button",i,n,v,a);}
function hInputC(i,n,v,a) {return hInput("checkbox",i,n,v,a);}
function hInputT(i,n,v,a) {return hInput("text",i,n,v,a);}
function hInputP(i,n,v,a) {return hInput("password",i,n,v,a);}
function hButton(t,l,n,v,a) {return hT(l, 'button', hA('type', t) + hA('value', v) + hA('name', n) + oa(a || null));}
function hButtonS(l,n,v) {return hButton('submit',l,n,v);}
function hFRow(l,c,h) {return hTr(hTd(hB(l)) + hTd(c) + (h?hTd(h):''));}
function ce(c, t) {
	var e = dc.createElement(t || 'div');
	if(c) e.className = c;
	return e;
}
function ge(id) {return dc.getElementById(id);}
function gt(o, tag) {return o.getElementsByTagName(tag);}
function euri(v) {return encodeURIComponent(v);}
function duri(v) {return decodeURIComponent(v);}
function uri(v) {return euri(v).replace(/%20/g,'+');}
function escp(v) {return v.replace(/\\/g,'\\\\').replace(/\"/g,'\\\"');}
function sh(e,v) {e.innerHTML = v;}
function gv(e) {return e.value;}
function sv(e,v) {e.value = v;}
function ric(r) {
	var i = 0;
	return function() {return r.insertCell(i++);};
}

function getFormValue(e) {
	var t = null, i, r = [], l = ln(e);
	if(l) t = e[0].type;
	if(!t) t = e.type;
	if(!t) return null;

	switch(t) {
	case 'radio':
		for(i = 0; i < l; ++i) if(e[i].checked) return gv(e[i]);
		return null;
	case 'select-multiple':
		for(i = 0; i < l; ++i) if(e[i].selected) r.push(gv(e[i]));
		return r.join(',');
	case 'checkbox':
		return e.checked;
	default:
		return gv(e);
	}
}

function getEncodeType(n) {
	return (n == 'l' || n == 'f') ? 2
		: (n == 'p' || n == 'i' || n == 'v' || n == 'u') ? 0 : 1;
}

function getForm(f, m, eq) {
	var r = ['{'], n, a = f.elements, i = 0, e, v, t;
	function p(v) {r.push(v);}
	for(; i < ln(a); ++i) {
		e = a[i];
		if(!e.name) continue;
		v = getFormValue(e);
		if(m) v = m(f, e.name, v);
		if(!v) continue;
		if(n) p(',');
		p('"' + e.name + '"' + eq);
		if(v === true) p(1);
		else if(v === false) p(0);
		else if(typeof v.replace === 'undefined') p(v);
		else {
			t = getEncodeType(e.name);
			p(t > 0 ? '"' + (t > 1 ? euri(v) : escp(v)) + '"' : v);
		}
		n = 1;
	}
	return r.join("") + '}';
}

function getFormJson(f, m) {
	return getForm(f, m, ":");
}

function postForm(f, u, v, vv, r, h, m) {
	if(v && !v(f, vv)) return false;
	var d = getFormJson(f, m);
	http(u, d, function(re, s) {
		if(ln(r)) sh(ge(r), re);
		if(h) h(re, s);
	});
	return false;
}

function js2j(t) {
	return eval("(" + t + ")");
}

function s2S(t) {
	return ln(t) > 3 ? t.slice(0, 1).toUpperCase() + t.slice(1) : t.toUpperCase();
}

function mbus(cmd, handler) {
	http("/send?cmd=" + uri(hexSum(cmd, true)), "", handler);
}

function escH(v) {
	return ("" + v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
