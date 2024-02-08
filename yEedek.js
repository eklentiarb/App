!function() {
    "use strict";
    function t(e, o) {
        var i;
        if (o = o || {},
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        this.targetElement = null,
        this.touchStartX = 0,
        this.touchStartY = 0,
        this.lastTouchIdentifier = 0,
        this.touchBoundary = o.touchBoundary || 10,
        this.layer = e,
        this.tapDelay = o.tapDelay || 200,
        this.tapTimeout = o.tapTimeout || 700,
        !t.notNeeded(e)) {
            for (var r = ["onMouse", "onClick", "onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel"], a = this, c = 0, s = r.length; c < s; c++)
                a[r[c]] = function(t, e) {
                    return function() {
                        return t.apply(e, arguments)
                    }
                }(a[r[c]], a);
            n && (e.addEventListener("mouseover", this.onMouse, !0),
            e.addEventListener("mousedown", this.onMouse, !0),
            e.addEventListener("mouseup", this.onMouse, !0)),
            e.addEventListener("click", this.onClick, !0),
            e.addEventListener("touchstart", this.onTouchStart, !1),
            e.addEventListener("touchmove", this.onTouchMove, !1),
            e.addEventListener("touchend", this.onTouchEnd, !1),
            e.addEventListener("touchcancel", this.onTouchCancel, !1),
            Event.prototype.stopImmediatePropagation || (e.removeEventListener = function(t, n, o) {
                var i = Node.prototype.removeEventListener;
                "click" === t ? i.call(e, t, n.hijacked || n, o) : i.call(e, t, n, o)
            }
            ,
            e.addEventListener = function(t, n, o) {
                var i = Node.prototype.addEventListener;
                "click" === t ? i.call(e, t, n.hijacked || (n.hijacked = function(t) {
                    t.propagationStopped || n(t)
                }
                ), o) : i.call(e, t, n, o)
            }
            ),
            "function" == typeof e.onclick && (i = e.onclick,
            e.addEventListener("click", function(t) {
                i(t)
            }, !1),
            e.onclick = null)
        }
    }
    var e = navigator.userAgent.indexOf("Windows Phone") >= 0
      , n = navigator.userAgent.indexOf("Android") > 0 && !e
      , o = /iP(ad|hone|od)/.test(navigator.userAgent) && !e
      , i = o && /OS 4_\d(_\d)?/.test(navigator.userAgent)
      , r = o && /OS [6-7]_\d/.test(navigator.userAgent)
      , a = navigator.userAgent.indexOf("BB10") > 0;
    t.prototype.needsClick = function(t) {
        switch (t.nodeName.toLowerCase()) {
        case "button":
        case "select":
        case "textarea":
            if (t.disabled)
                return !0;
            break;
        case "input":
            if (o && "file" === t.type || t.disabled)
                return !0;
            break;
        case "label":
        case "iframe":
        case "video":
            return !0
        }
        return /\bneedsclick\b/.test(t.className)
    }
    ,
    t.prototype.needsFocus = function(t) {
        switch (t.nodeName.toLowerCase()) {
        case "textarea":
            return !0;
        case "select":
            return !n;
        case "input":
            switch (t.type) {
            case "button":
            case "checkbox":
            case "file":
            case "image":
            case "radio":
            case "submit":
                return !1
            }
            return !t.disabled && !t.readOnly;
        default:
            return /\bneedsfocus\b/.test(t.className)
        }
    }
    ,
    t.prototype.sendClick = function(t, e) {
        var n, o;
        document.activeElement && document.activeElement !== t && document.activeElement.blur(),
        o = e.changedTouches[0],
        n = document.createEvent("MouseEvents"),
        n.initMouseEvent(this.determineEventType(t), !0, !0, window, 1, o.screenX, o.screenY, o.clientX, o.clientY, !1, !1, !1, !1, 0, null),
        n.forwardedTouchEvent = !0,
        t.dispatchEvent(n)
    }
    ,
    t.prototype.determineEventType = function(t) {
        return n && "select" === t.tagName.toLowerCase() ? "mousedown" : "click"
    }
    ,
    t.prototype.focus = function(t) {
        var e;
        o && t.setSelectionRange && 0 !== t.type.indexOf("date") && "time" !== t.type && "month" !== t.type ? (e = t.value.length,
        t.setSelectionRange(e, e)) : t.focus()
    }
    ,
    t.prototype.updateScrollParent = function(t) {
        var e, n;
        if (!(e = t.fastClickScrollParent) || !e.contains(t)) {
            n = t;
            do {
                if (n.scrollHeight > n.offsetHeight) {
                    e = n,
                    t.fastClickScrollParent = n;
                    break
                }
                n = n.parentElement
            } while (n)
        }
        e && (e.fastClickLastScrollTop = e.scrollTop)
    }
    ,
    t.prototype.getTargetElementFromEventTarget = function(t) {
        return t.nodeType === Node.TEXT_NODE ? t.parentNode : t
    }
    ,
    t.prototype.onTouchStart = function(t) {
        var e, n, r;
        if (t.targetTouches.length > 1)
            return !0;
        if (e = this.getTargetElementFromEventTarget(t.target),
        n = t.targetTouches[0],
        o) {
            if (r = window.getSelection(),
            r.rangeCount && !r.isCollapsed)
                return !0;
            if (!i) {
                if (n.identifier && n.identifier === this.lastTouchIdentifier)
                    return t.preventDefault(),
                    !1;
                this.lastTouchIdentifier = n.identifier,
                this.updateScrollParent(e)
            }
        }
        return this.trackingClick = !0,
        this.trackingClickStart = t.timeStamp,
        this.targetElement = e,
        this.touchStartX = n.pageX,
        this.touchStartY = n.pageY,
        t.timeStamp - this.lastClickTime < this.tapDelay && t.preventDefault(),
        !0
    }
    ,
    t.prototype.touchHasMoved = function(t) {
        var e = t.changedTouches[0]
          , n = this.touchBoundary;
        return Math.abs(e.pageX - this.touchStartX) > n || Math.abs(e.pageY - this.touchStartY) > n
    }
    ,
    t.prototype.onTouchMove = function(t) {
        return !this.trackingClick || ((this.targetElement !== this.getTargetElementFromEventTarget(t.target) || this.touchHasMoved(t)) && (this.trackingClick = !1,
        this.targetElement = null),
        !0)
    }
    ,
    t.prototype.findControl = function(t) {
        return void 0 !== t.control ? t.control : t.htmlFor ? document.getElementById(t.htmlFor) : t.querySelector("button, input:not([type=hidden]), keygen, meter, output, progress, select, textarea")
    }
    ,
    t.prototype.onTouchEnd = function(t) {
        var e, a, c, s, u, l = this.targetElement;
        if (!this.trackingClick)
            return !0;
        if (t.timeStamp - this.lastClickTime < this.tapDelay)
            return this.cancelNextClick = !0,
            !0;
        if (t.timeStamp - this.trackingClickStart > this.tapTimeout)
            return !0;
        if (this.cancelNextClick = !1,
        this.lastClickTime = t.timeStamp,
        a = this.trackingClickStart,
        this.trackingClick = !1,
        this.trackingClickStart = 0,
        r && (u = t.changedTouches[0],
        l = document.elementFromPoint(u.pageX - window.pageXOffset, u.pageY - window.pageYOffset) || l,
        l.fastClickScrollParent = this.targetElement.fastClickScrollParent),
        "label" === (c = l.tagName.toLowerCase())) {
            if (e = this.findControl(l)) {
                if (this.focus(l),
                n)
                    return !1;
                l = e
            }
        } else if (this.needsFocus(l))
            return t.timeStamp - a > 100 || o && window.top !== window && "input" === c ? (this.targetElement = null,
            !1) : (this.focus(l),
            this.sendClick(l, t),
            o && "select" === c || (this.targetElement = null,
            t.preventDefault()),
            !1);
        return !(!o || i || !(s = l.fastClickScrollParent) || s.fastClickLastScrollTop === s.scrollTop) || (this.needsClick(l) || (t.preventDefault(),
        this.sendClick(l, t)),
        !1)
    }
    ,
    t.prototype.onTouchCancel = function() {
        this.trackingClick = !1,
        this.targetElement = null
    }
    ,
    t.prototype.onMouse = function(t) {
        return !this.targetElement || (!!t.forwardedTouchEvent || (!t.cancelable || (!(!this.needsClick(this.targetElement) || this.cancelNextClick) || (t.stopImmediatePropagation ? t.stopImmediatePropagation() : t.propagationStopped = !0,
        t.stopPropagation(),
        t.preventDefault(),
        !1))))
    }
    ,
    t.prototype.onClick = function(t) {
        var e;
        return this.trackingClick ? (this.targetElement = null,
        this.trackingClick = !1,
        !0) : "submit" === t.target.type && 0 === t.detail || (e = this.onMouse(t),
        e || (this.targetElement = null),
        e)
    }
    ,
    t.prototype.destroy = function() {
        var t = this.layer;
        n && (t.removeEventListener("mouseover", this.onMouse, !0),
        t.removeEventListener("mousedown", this.onMouse, !0),
        t.removeEventListener("mouseup", this.onMouse, !0)),
        t.removeEventListener("click", this.onClick, !0),
        t.removeEventListener("touchstart", this.onTouchStart, !1),
        t.removeEventListener("touchmove", this.onTouchMove, !1),
        t.removeEventListener("touchend", this.onTouchEnd, !1),
        t.removeEventListener("touchcancel", this.onTouchCancel, !1)
    }
    ,
    t.notNeeded = function(t) {
        var e, o, i;
        if (void 0 === window.ontouchstart)
            return !0;
        if (o = +(/Chrome\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1]) {
            if (!n)
                return !0;
            if (e = document.querySelector("meta[name=viewport]")) {
                if (-1 !== e.content.indexOf("user-scalable=no"))
                    return !0;
                if (o > 31 && document.documentElement.scrollWidth <= window.outerWidth)
                    return !0
            }
        }
        if (a && (i = navigator.userAgent.match(/Version\/([0-9]*)\.([0-9]*)/),
        i[1] >= 10 && i[2] >= 3 && (e = document.querySelector("meta[name=viewport]")))) {
            if (-1 !== e.content.indexOf("user-scalable=no"))
                return !0;
            if (document.documentElement.scrollWidth <= window.outerWidth)
                return !0
        }
        return "none" === t.style.msTouchAction || "manipulation" === t.style.touchAction || (!!(+(/Firefox\/([0-9]+)/.exec(navigator.userAgent) || [, 0])[1] >= 27 && (e = document.querySelector("meta[name=viewport]")) && (-1 !== e.content.indexOf("user-scalable=no") || document.documentElement.scrollWidth <= window.outerWidth)) || ("none" === t.style.touchAction || "manipulation" === t.style.touchAction))
    }
    ,
    t.attach = function(e, n) {
        return new t(e,n)
    }
    ,
    "function" == typeof define && "object" == typeof define.amd && define.amd ? define(function() {
        return t
    }) : "undefined" != typeof module && module.exports ? (module.exports = t.attach,
    module.exports.FastClick = t) : window.FastClick = t
}();
!function(e, t) {
    "use strict";
    "object" == typeof module && "object" == typeof module.exports ? module.exports = e.document ? t(e, !0) : function(e) {
        if (!e.document)
            throw new Error("jQuery requires a window with a document");
        return t(e)
    }
    : t(e)
}("undefined" != typeof window ? window : this, function(e, t) {
    "use strict";
    function n(e, t, n) {
        var r, i, o = (n = n || fe).createElement("script");
        if (o.text = e,
        t)
            for (r in pe)
                (i = t[r] || t.getAttribute && t.getAttribute(r)) && o.setAttribute(r, i);
        n.head.appendChild(o).parentNode.removeChild(o)
    }
    function r(e) {
        return null == e ? e + "" : "object" == typeof e || "function" == typeof e ? re[ie.call(e)] || "object" : typeof e
    }
    function i(e) {
        var t = !!e && "length"in e && e.length
          , n = r(e);
        return !le(e) && !ce(e) && ("array" === n || 0 === t || "number" == typeof t && 0 < t && t - 1 in e)
    }
    function o(e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }
    function a(e, t, n) {
        return le(t) ? he.grep(e, function(e, r) {
            return !!t.call(e, r, e) !== n
        }) : t.nodeType ? he.grep(e, function(e) {
            return e === t !== n
        }) : "string" != typeof t ? he.grep(e, function(e) {
            return -1 < ne.call(t, e) !== n
        }) : he.filter(t, e, n)
    }
    function s(e, t) {
        for (; (e = e[t]) && 1 !== e.nodeType; )
            ;
        return e
    }
    function u(e) {
        return e
    }
    function l(e) {
        throw e
    }
    function c(e, t, n, r) {
        var i;
        try {
            e && le(i = e.promise) ? i.call(e).done(t).fail(n) : e && le(i = e.then) ? i.call(e, t, n) : t.apply(void 0, [e].slice(r))
        } catch (e) {
            n.apply(void 0, [e])
        }
    }
    function f() {
        fe.removeEventListener("DOMContentLoaded", f),
        e.removeEventListener("load", f),
        he.ready()
    }
    function p(e, t) {
        return t.toUpperCase()
    }
    function d(e) {
        return e.replace(Ne, "ms-").replace(je, p)
    }
    function h() {
        this.expando = he.expando + h.uid++
    }
    function g(e, t, n) {
        var r, i;
        if (void 0 === n && 1 === e.nodeType)
            if (r = "data-" + t.replace(Oe, "-$&").toLowerCase(),
            "string" == typeof (n = e.getAttribute(r))) {
                try {
                    n = "true" === (i = n) || "false" !== i && ("null" === i ? null : i === +i + "" ? +i : He.test(i) ? JSON.parse(i) : i)
                } catch (e) {}
                Le.set(e, t, n)
            } else
                n = void 0;
        return n
    }
    function v(e, t, n, r) {
        var i, o, a = 20, s = r ? function() {
            return r.cur()
        }
        : function() {
            return he.css(e, t, "")
        }
        , u = s(), l = n && n[3] || (he.cssNumber[t] ? "" : "px"), c = e.nodeType && (he.cssNumber[t] || "px" !== l && +u) && Re.exec(he.css(e, t));
        if (c && c[3] !== l) {
            for (u /= 2,
            l = l || c[3],
            c = +u || 1; a--; )
                he.style(e, t, c + l),
                (1 - o) * (1 - (o = s() / u || .5)) <= 0 && (a = 0),
                c /= o;
            c *= 2,
            he.style(e, t, c + l),
            n = n || []
        }
        return n && (c = +c || +u || 0,
        i = n[1] ? c + (n[1] + 1) * n[2] : +n[2],
        r && (r.unit = l,
        r.start = c,
        r.end = i)),
        i
    }
    function y(e, t) {
        for (var n, r, i, o, a, s, u, l = [], c = 0, f = e.length; c < f; c++)
            (r = e[c]).style && (n = r.style.display,
            t ? ("none" === n && (l[c] = qe.get(r, "display") || null,
            l[c] || (r.style.display = "")),
            "" === r.style.display && Be(r) && (l[c] = (u = a = o = void 0,
            a = (i = r).ownerDocument,
            s = i.nodeName,
            (u = $e[s]) || (o = a.body.appendChild(a.createElement(s)),
            u = he.css(o, "display"),
            o.parentNode.removeChild(o),
            "none" === u && (u = "block"),
            $e[s] = u)))) : "none" !== n && (l[c] = "none",
            qe.set(r, "display", n)));
        for (c = 0; c < f; c++)
            null != l[c] && (e[c].style.display = l[c]);
        return e
    }
    function m(e, t) {
        var n;
        return n = void 0 !== e.getElementsByTagName ? e.getElementsByTagName(t || "*") : void 0 !== e.querySelectorAll ? e.querySelectorAll(t || "*") : [],
        void 0 === t || t && o(e, t) ? he.merge([e], n) : n
    }
    function x(e, t) {
        for (var n = 0, r = e.length; n < r; n++)
            qe.set(e[n], "globalEval", !t || qe.get(t[n], "globalEval"))
    }
    function b(e, t, n, i, o) {
        for (var a, s, u, l, c, f, p = t.createDocumentFragment(), d = [], h = 0, g = e.length; h < g; h++)
            if ((a = e[h]) || 0 === a)
                if ("object" === r(a))
                    he.merge(d, a.nodeType ? [a] : a);
                else if (Ye.test(a)) {
                    for (s = s || p.appendChild(t.createElement("div")),
                    u = (Xe.exec(a) || ["", ""])[1].toLowerCase(),
                    l = Ge[u] || Ge._default,
                    s.innerHTML = l[1] + he.htmlPrefilter(a) + l[2],
                    f = l[0]; f--; )
                        s = s.lastChild;
                    he.merge(d, s.childNodes),
                    (s = p.firstChild).textContent = ""
                } else
                    d.push(t.createTextNode(a));
        for (p.textContent = "",
        h = 0; a = d[h++]; )
            if (i && -1 < he.inArray(a, i))
                o && o.push(a);
            else if (c = We(a),
            s = m(p.appendChild(a), "script"),
            c && x(s),
            n)
                for (f = 0; a = s[f++]; )
                    Ve.test(a.type || "") && n.push(a);
        return p
    }
    function w() {
        return !0
    }
    function T() {
        return !1
    }
    function C(e, t) {
        return e === function() {
            try {
                return fe.activeElement
            } catch (e) {}
        }() == ("focus" === t)
    }
    function E(e, t, n, r, i, o) {
        var a, s;
        if ("object" == typeof t) {
            for (s in "string" != typeof n && (r = r || n,
            n = void 0),
            t)
                E(e, s, n, r, t[s], o);
            return e
        }
        if (null == r && null == i ? (i = n,
        r = n = void 0) : null == i && ("string" == typeof n ? (i = r,
        r = void 0) : (i = r,
        r = n,
        n = void 0)),
        !1 === i)
            i = T;
        else if (!i)
            return e;
        return 1 === o && (a = i,
        (i = function(e) {
            return he().off(e),
            a.apply(this, arguments)
        }
        ).guid = a.guid || (a.guid = he.guid++)),
        e.each(function() {
            he.event.add(this, t, i, r, n)
        })
    }
    function S(e, t, n) {
        n ? (qe.set(e, t, !1),
        he.event.add(e, t, {
            namespace: !1,
            handler: function(e) {
                var r, i, o = qe.get(this, t);
                if (1 & e.isTrigger && this[t]) {
                    if (o.length)
                        (he.event.special[t] || {}).delegateType && e.stopPropagation();
                    else if (o = Z.call(arguments),
                    qe.set(this, t, o),
                    r = n(this, t),
                    this[t](),
                    o !== (i = qe.get(this, t)) || r ? qe.set(this, t, !1) : i = {},
                    o !== i)
                        return e.stopImmediatePropagation(),
                        e.preventDefault(),
                        i && i.value
                } else
                    o.length && (qe.set(this, t, {
                        value: he.event.trigger(he.extend(o[0], he.Event.prototype), o.slice(1), this)
                    }),
                    e.stopImmediatePropagation())
            }
        })) : void 0 === qe.get(e, t) && he.event.add(e, t, w)
    }
    function k(e, t) {
        return o(e, "table") && o(11 !== t.nodeType ? t : t.firstChild, "tr") && he(e).children("tbody")[0] || e
    }
    function A(e) {
        return e.type = (null !== e.getAttribute("type")) + "/" + e.type,
        e
    }
    function N(e) {
        return "true/" === (e.type || "").slice(0, 5) ? e.type = e.type.slice(5) : e.removeAttribute("type"),
        e
    }
    function j(e, t) {
        var n, r, i, o, a, s;
        if (1 === t.nodeType) {
            if (qe.hasData(e) && (s = qe.get(e).events))
                for (i in qe.remove(t, "handle events"),
                s)
                    for (n = 0,
                    r = s[i].length; n < r; n++)
                        he.event.add(t, i, s[i][n]);
            Le.hasData(e) && (o = Le.access(e),
            a = he.extend({}, o),
            Le.set(t, a))
        }
    }
    function D(e, t, r, i) {
        t = ee(t);
        var o, a, s, u, l, c, f = 0, p = e.length, d = p - 1, h = t[0], g = le(h);
        if (g || 1 < p && "string" == typeof h && !ue.checkClone && Ke.test(h))
            return e.each(function(n) {
                var o = e.eq(n);
                g && (t[0] = h.call(this, n, o.html())),
                D(o, t, r, i)
            });
        if (p && (a = (o = b(t, e[0].ownerDocument, !1, e, i)).firstChild,
        1 === o.childNodes.length && (o = a),
        a || i)) {
            for (u = (s = he.map(m(o, "script"), A)).length; f < p; f++)
                l = o,
                f !== d && (l = he.clone(l, !0, !0),
                u && he.merge(s, m(l, "script"))),
                r.call(e[f], l, f);
            if (u)
                for (c = s[s.length - 1].ownerDocument,
                he.map(s, N),
                f = 0; f < u; f++)
                    l = s[f],
                    Ve.test(l.type || "") && !qe.access(l, "globalEval") && he.contains(c, l) && (l.src && "module" !== (l.type || "").toLowerCase() ? he._evalUrl && !l.noModule && he._evalUrl(l.src, {
                        nonce: l.nonce || l.getAttribute("nonce")
                    }, c) : n(l.textContent.replace(Ze, ""), l, c))
        }
        return e
    }
    function q(e, t, n) {
        for (var r, i = t ? he.filter(t, e) : e, o = 0; null != (r = i[o]); o++)
            n || 1 !== r.nodeType || he.cleanData(m(r)),
            r.parentNode && (n && We(r) && x(m(r, "script")),
            r.parentNode.removeChild(r));
        return e
    }
    function L(e, t, n) {
        var r, i, o, a, s = e.style;
        return (n = n || tt(e)) && ("" !== (a = n.getPropertyValue(t) || n[t]) || We(e) || (a = he.style(e, t)),
        !ue.pixelBoxStyles() && et.test(a) && rt.test(t) && (r = s.width,
        i = s.minWidth,
        o = s.maxWidth,
        s.minWidth = s.maxWidth = s.width = a,
        a = n.width,
        s.width = r,
        s.minWidth = i,
        s.maxWidth = o)),
        void 0 !== a ? a + "" : a
    }
    function H(e, t) {
        return {
            get: function() {
                if (!e())
                    return (this.get = t).apply(this, arguments);
                delete this.get
            }
        }
    }
    function O(e) {
        return he.cssProps[e] || at[e] || (e in ot ? e : at[e] = function(e) {
            for (var t = e[0].toUpperCase() + e.slice(1), n = it.length; n--; )
                if ((e = it[n] + t)in ot)
                    return e
        }(e) || e)
    }
    function P(e, t, n) {
        var r = Re.exec(t);
        return r ? Math.max(0, r[2] - (n || 0)) + (r[3] || "px") : t
    }
    function R(e, t, n, r, i, o) {
        var a = "width" === t ? 1 : 0
          , s = 0
          , u = 0;
        if (n === (r ? "border" : "content"))
            return 0;
        for (; a < 4; a += 2)
            "margin" === n && (u += he.css(e, n + Me[a], !0, i)),
            r ? ("content" === n && (u -= he.css(e, "padding" + Me[a], !0, i)),
            "margin" !== n && (u -= he.css(e, "border" + Me[a] + "Width", !0, i))) : (u += he.css(e, "padding" + Me[a], !0, i),
            "padding" !== n ? u += he.css(e, "border" + Me[a] + "Width", !0, i) : s += he.css(e, "border" + Me[a] + "Width", !0, i));
        return !r && 0 <= o && (u += Math.max(0, Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - o - u - s - .5)) || 0),
        u
    }
    function M(e, t, n) {
        var r = tt(e)
          , i = (!ue.boxSizingReliable() || n) && "border-box" === he.css(e, "boxSizing", !1, r)
          , a = i
          , s = L(e, t, r)
          , u = "offset" + t[0].toUpperCase() + t.slice(1);
        if (et.test(s)) {
            if (!n)
                return s;
            s = "auto"
        }
        return (!ue.boxSizingReliable() && i || !ue.reliableTrDimensions() && o(e, "tr") || "auto" === s || !parseFloat(s) && "inline" === he.css(e, "display", !1, r)) && e.getClientRects().length && (i = "border-box" === he.css(e, "boxSizing", !1, r),
        (a = u in e) && (s = e[u])),
        (s = parseFloat(s) || 0) + R(e, t, n || (i ? "border" : "content"), a, r, s) + "px"
    }
    function I(e, t, n, r, i) {
        return new I.prototype.init(e,t,n,r,i)
    }
    function W() {
        pt && (!1 === fe.hidden && e.requestAnimationFrame ? e.requestAnimationFrame(W) : e.setTimeout(W, he.fx.interval),
        he.fx.tick())
    }
    function F() {
        return e.setTimeout(function() {
            ft = void 0
        }),
        ft = Date.now()
    }
    function B(e, t) {
        var n, r = 0, i = {
            height: e
        };
        for (t = t ? 1 : 0; r < 4; r += 2 - t)
            i["margin" + (n = Me[r])] = i["padding" + n] = e;
        return t && (i.opacity = i.width = e),
        i
    }
    function $(e, t, n) {
        for (var r, i = (_.tweeners[t] || []).concat(_.tweeners["*"]), o = 0, a = i.length; o < a; o++)
            if (r = i[o].call(n, t, e))
                return r
    }
    function _(e, t, n) {
        var r, i, o = 0, a = _.prefilters.length, s = he.Deferred().always(function() {
            delete u.elem
        }), u = function() {
            if (i)
                return !1;
            for (var t = ft || F(), n = Math.max(0, l.startTime + l.duration - t), r = 1 - (n / l.duration || 0), o = 0, a = l.tweens.length; o < a; o++)
                l.tweens[o].run(r);
            return s.notifyWith(e, [l, r, n]),
            r < 1 && a ? n : (a || s.notifyWith(e, [l, 1, 0]),
            s.resolveWith(e, [l]),
            !1)
        }, l = s.promise({
            elem: e,
            props: he.extend({}, t),
            opts: he.extend(!0, {
                specialEasing: {},
                easing: he.easing._default
            }, n),
            originalProperties: t,
            originalOptions: n,
            startTime: ft || F(),
            duration: n.duration,
            tweens: [],
            createTween: function(t, n) {
                var r = he.Tween(e, l.opts, t, n, l.opts.specialEasing[t] || l.opts.easing);
                return l.tweens.push(r),
                r
            },
            stop: function(t) {
                var n = 0
                  , r = t ? l.tweens.length : 0;
                if (i)
                    return this;
                for (i = !0; n < r; n++)
                    l.tweens[n].run(1);
                return t ? (s.notifyWith(e, [l, 1, 0]),
                s.resolveWith(e, [l, t])) : s.rejectWith(e, [l, t]),
                this
            }
        }), c = l.props;
        for ((!function(e, t) {
            var n, r, i, o, a;
            for (n in e)
                if (i = t[r = d(n)],
                o = e[n],
                Array.isArray(o) && (i = o[1],
                o = e[n] = o[0]),
                n !== r && (e[r] = o,
                delete e[n]),
                (a = he.cssHooks[r]) && "expand"in a)
                    for (n in o = a.expand(o),
                    delete e[r],
                    o)
                        n in e || (e[n] = o[n],
                        t[n] = i);
                else
                    t[r] = i
        }(c, l.opts.specialEasing)); o < a; o++)
            if (r = _.prefilters[o].call(l, e, c, l.opts))
                return le(r.stop) && (he._queueHooks(l.elem, l.opts.queue).stop = r.stop.bind(r)),
                r;
        return he.map(c, $, l),
        le(l.opts.start) && l.opts.start.call(e, l),
        l.progress(l.opts.progress).done(l.opts.done, l.opts.complete).fail(l.opts.fail).always(l.opts.always),
        he.fx.timer(he.extend(u, {
            elem: e,
            anim: l,
            queue: l.opts.queue
        })),
        l
    }
    function z(e) {
        return (e.match(Ee) || []).join(" ")
    }
    function U(e) {
        return e.getAttribute && e.getAttribute("class") || ""
    }
    function X(e) {
        return Array.isArray(e) ? e : "string" == typeof e && e.match(Ee) || []
    }
    function V(e, t, n, i) {
        var o;
        if (Array.isArray(t))
            he.each(t, function(t, r) {
                n || At.test(e) ? i(e, r) : V(e + "[" + ("object" == typeof r && null != r ? t : "") + "]", r, n, i)
            });
        else if (n || "object" !== r(t))
            i(e, t);
        else
            for (o in t)
                V(e + "[" + o + "]", t[o], n, i)
    }
    function G(e) {
        return function(t, n) {
            "string" != typeof t && (n = t,
            t = "*");
            var r, i = 0, o = t.toLowerCase().match(Ee) || [];
            if (le(n))
                for (; r = o[i++]; )
                    "+" === r[0] ? (r = r.slice(1) || "*",
                    (e[r] = e[r] || []).unshift(n)) : (e[r] = e[r] || []).push(n)
        }
    }
    function Y(e, t, n, r) {
        function i(s) {
            var u;
            return o[s] = !0,
            he.each(e[s] || [], function(e, s) {
                var l = s(t, n, r);
                return "string" != typeof l || a || o[l] ? a ? !(u = l) : void 0 : (t.dataTypes.unshift(l),
                i(l),
                !1)
            }),
            u
        }
        var o = {}
          , a = e === It;
        return i(t.dataTypes[0]) || !o["*"] && i("*")
    }
    function Q(e, t) {
        var n, r, i = he.ajaxSettings.flatOptions || {};
        for (n in t)
            void 0 !== t[n] && ((i[n] ? e : r || (r = {}))[n] = t[n]);
        return r && he.extend(!0, e, r),
        e
    }
    var J = []
      , K = Object.getPrototypeOf
      , Z = J.slice
      , ee = J.flat ? function(e) {
        return J.flat.call(e)
    }
    : function(e) {
        return J.concat.apply([], e)
    }
      , te = J.push
      , ne = J.indexOf
      , re = {}
      , ie = re.toString
      , oe = re.hasOwnProperty
      , ae = oe.toString
      , se = ae.call(Object)
      , ue = {}
      , le = function(e) {
        return "function" == typeof e && "number" != typeof e.nodeType && "function" != typeof e.item
    }
      , ce = function(e) {
        return null != e && e === e.window
    }
      , fe = e.document
      , pe = {
        type: !0,
        src: !0,
        nonce: !0,
        noModule: !0
    }
      , de = "3.6.0"
      , he = function(e, t) {
        return new he.fn.init(e,t)
    };
    he.fn = he.prototype = {
        jquery: de,
        constructor: he,
        length: 0,
        toArray: function() {
            return Z.call(this)
        },
        get: function(e) {
            return null == e ? Z.call(this) : e < 0 ? this[e + this.length] : this[e]
        },
        pushStack: function(e) {
            var t = he.merge(this.constructor(), e);
            return t.prevObject = this,
            t
        },
        each: function(e) {
            return he.each(this, e)
        },
        map: function(e) {
            return this.pushStack(he.map(this, function(t, n) {
                return e.call(t, n, t)
            }))
        },
        slice: function() {
            return this.pushStack(Z.apply(this, arguments))
        },
        first: function() {
            return this.eq(0)
        },
        last: function() {
            return this.eq(-1)
        },
        even: function() {
            return this.pushStack(he.grep(this, function(e, t) {
                return (t + 1) % 2
            }))
        },
        odd: function() {
            return this.pushStack(he.grep(this, function(e, t) {
                return t % 2
            }))
        },
        eq: function(e) {
            var t = this.length
              , n = +e + (e < 0 ? t : 0);
            return this.pushStack(0 <= n && n < t ? [this[n]] : [])
        },
        end: function() {
            return this.prevObject || this.constructor()
        },
        push: te,
        sort: J.sort,
        splice: J.splice
    },
    he.extend = he.fn.extend = function() {
        var e, t, n, r, i, o, a = arguments[0] || {}, s = 1, u = arguments.length, l = !1;
        for ("boolean" == typeof a && (l = a,
        a = arguments[s] || {},
        s++),
        "object" == typeof a || le(a) || (a = {}),
        s === u && (a = this,
        s--); s < u; s++)
            if (null != (e = arguments[s]))
                for (t in e)
                    r = e[t],
                    "__proto__" !== t && a !== r && (l && r && (he.isPlainObject(r) || (i = Array.isArray(r))) ? (n = a[t],
                    o = i && !Array.isArray(n) ? [] : i || he.isPlainObject(n) ? n : {},
                    i = !1,
                    a[t] = he.extend(l, o, r)) : void 0 !== r && (a[t] = r));
        return a
    }
    ,
    he.extend({
        expando: "jQuery" + (de + Math.random()).replace(/\D/g, ""),
        isReady: !0,
        error: function(e) {
            throw new Error(e)
        },
        noop: function() {},
        isPlainObject: function(e) {
            var t, n;
            return !(!e || "[object Object]" !== ie.call(e) || (t = K(e)) && ("function" != typeof (n = oe.call(t, "constructor") && t.constructor) || ae.call(n) !== se))
        },
        isEmptyObject: function(e) {
            var t;
            for (t in e)
                return !1;
            return !0
        },
        globalEval: function(e, t, r) {
            n(e, {
                nonce: t && t.nonce
            }, r)
        },
        each: function(e, t) {
            var n, r = 0;
            if (i(e))
                for (n = e.length; r < n && !1 !== t.call(e[r], r, e[r]); r++)
                    ;
            else
                for (r in e)
                    if (!1 === t.call(e[r], r, e[r]))
                        break;
            return e
        },
        makeArray: function(e, t) {
            var n = t || [];
            return null != e && (i(Object(e)) ? he.merge(n, "string" == typeof e ? [e] : e) : te.call(n, e)),
            n
        },
        inArray: function(e, t, n) {
            return null == t ? -1 : ne.call(t, e, n)
        },
        merge: function(e, t) {
            for (var n = +t.length, r = 0, i = e.length; r < n; r++)
                e[i++] = t[r];
            return e.length = i,
            e
        },
        grep: function(e, t, n) {
            for (var r = [], i = 0, o = e.length, a = !n; i < o; i++)
                !t(e[i], i) !== a && r.push(e[i]);
            return r
        },
        map: function(e, t, n) {
            var r, o, a = 0, s = [];
            if (i(e))
                for (r = e.length; a < r; a++)
                    null != (o = t(e[a], a, n)) && s.push(o);
            else
                for (a in e)
                    null != (o = t(e[a], a, n)) && s.push(o);
            return ee(s)
        },
        guid: 1,
        support: ue
    }),
    "function" == typeof Symbol && (he.fn[Symbol.iterator] = J[Symbol.iterator]),
    he.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(e, t) {
        re["[object " + t + "]"] = t.toLowerCase()
    });
    var ge = function(e) {
        function t(e, t, n, r) {
            var i, o, a, s, u, c, p, d = t && t.ownerDocument, h = t ? t.nodeType : 9;
            if (n = n || [],
            "string" != typeof e || !e || 1 !== h && 9 !== h && 11 !== h)
                return n;
            if (!r && (N(t),
            t = t || j,
            q)) {
                if (11 !== h && (u = ge.exec(e)))
                    if (i = u[1]) {
                        if (9 === h) {
                            if (!(a = t.getElementById(i)))
                                return n;
                            if (a.id === i)
                                return n.push(a),
                                n
                        } else if (d && (a = d.getElementById(i)) && P(t, a) && a.id === i)
                            return n.push(a),
                            n
                    } else {
                        if (u[2])
                            return Y.apply(n, t.getElementsByTagName(e)),
                            n;
                        if ((i = u[3]) && m.getElementsByClassName && t.getElementsByClassName)
                            return Y.apply(n, t.getElementsByClassName(i)),
                            n
                    }
                if (m.qsa && !_[e + " "] && (!L || !L.test(e)) && (1 !== h || "object" !== t.nodeName.toLowerCase())) {
                    if (p = e,
                    d = t,
                    1 === h && (se.test(e) || ae.test(e))) {
                        for ((d = ve.test(e) && l(t.parentNode) || t) === t && m.scope || ((s = t.getAttribute("id")) ? s = s.replace(xe, be) : t.setAttribute("id", s = R)),
                        o = (c = T(e)).length; o--; )
                            c[o] = (s ? "#" + s : ":scope") + " " + f(c[o]);
                        p = c.join(",")
                    }
                    try {
                        return Y.apply(n, d.querySelectorAll(p)),
                        n
                    } catch (t) {
                        _(e, !0)
                    } finally {
                        s === R && t.removeAttribute("id")
                    }
                }
            }
            return E(e.replace(ie, "$1"), t, n, r)
        }
        function n() {
            var e = [];
            return function t(n, r) {
                return e.push(n + " ") > x.cacheLength && delete t[e.shift()],
                t[n + " "] = r
            }
        }
        function r(e) {
            return e[R] = !0,
            e
        }
        function i(e) {
            var t = j.createElement("fieldset");
            try {
                return !!e(t)
            } catch (e) {
                return !1
            } finally {
                t.parentNode && t.parentNode.removeChild(t),
                t = null
            }
        }
        function o(e, t) {
            for (var n = e.split("|"), r = n.length; r--; )
                x.attrHandle[n[r]] = t
        }
        function a(e, t) {
            var n = t && e
              , r = n && 1 === e.nodeType && 1 === t.nodeType && e.sourceIndex - t.sourceIndex;
            if (r)
                return r;
            if (n)
                for (; n = n.nextSibling; )
                    if (n === t)
                        return -1;
            return e ? 1 : -1
        }
        function s(e) {
            return function(t) {
                return "form"in t ? t.parentNode && !1 === t.disabled ? "label"in t ? "label"in t.parentNode ? t.parentNode.disabled === e : t.disabled === e : t.isDisabled === e || t.isDisabled !== !e && Te(t) === e : t.disabled === e : "label"in t && t.disabled === e
            }
        }
        function u(e) {
            return r(function(t) {
                return t = +t,
                r(function(n, r) {
                    for (var i, o = e([], n.length, t), a = o.length; a--; )
                        n[i = o[a]] && (n[i] = !(r[i] = n[i]))
                })
            })
        }
        function l(e) {
            return e && void 0 !== e.getElementsByTagName && e
        }
        function c() {}
        function f(e) {
            for (var t = 0, n = e.length, r = ""; t < n; t++)
                r += e[t].value;
            return r
        }
        function p(e, t, n) {
            var r = t.dir
              , i = t.next
              , o = i || r
              , a = n && "parentNode" === o
              , s = W++;
            return t.first ? function(t, n, i) {
                for (; t = t[r]; )
                    if (1 === t.nodeType || a)
                        return e(t, n, i);
                return !1
            }
            : function(t, n, u) {
                var l, c, f, p = [I, s];
                if (u) {
                    for (; t = t[r]; )
                        if ((1 === t.nodeType || a) && e(t, n, u))
                            return !0
                } else
                    for (; t = t[r]; )
                        if (1 === t.nodeType || a)
                            if (c = (f = t[R] || (t[R] = {}))[t.uniqueID] || (f[t.uniqueID] = {}),
                            i && i === t.nodeName.toLowerCase())
                                t = t[r] || t;
                            else {
                                if ((l = c[o]) && l[0] === I && l[1] === s)
                                    return p[2] = l[2];
                                if ((c[o] = p)[2] = e(t, n, u))
                                    return !0
                            }
                return !1
            }
        }
        function d(e) {
            return 1 < e.length ? function(t, n, r) {
                for (var i = e.length; i--; )
                    if (!e[i](t, n, r))
                        return !1;
                return !0
            }
            : e[0]
        }
        function h(e, t, n, r, i) {
            for (var o, a = [], s = 0, u = e.length, l = null != t; s < u; s++)
                (o = e[s]) && (n && !n(o, r, i) || (a.push(o),
                l && t.push(s)));
            return a
        }
        function g(e, n, i, o, a, s) {
            return o && !o[R] && (o = g(o)),
            a && !a[R] && (a = g(a, s)),
            r(function(r, s, u, l) {
                var c, f, p, d = [], g = [], v = s.length, y = r || function(e, n, r) {
                    for (var i = 0, o = n.length; i < o; i++)
                        t(e, n[i], r);
                    return r
                }(n || "*", u.nodeType ? [u] : u, []), m = !e || !r && n ? y : h(y, d, e, u, l), x = i ? a || (r ? e : v || o) ? [] : s : m;
                if (i && i(m, x, u, l),
                o)
                    for (c = h(x, g),
                    o(c, [], u, l),
                    f = c.length; f--; )
                        (p = c[f]) && (x[g[f]] = !(m[g[f]] = p));
                if (r) {
                    if (a || e) {
                        if (a) {
                            for (c = [],
                            f = x.length; f--; )
                                (p = x[f]) && c.push(m[f] = p);
                            a(null, x = [], c, l)
                        }
                        for (f = x.length; f--; )
                            (p = x[f]) && -1 < (c = a ? J(r, p) : d[f]) && (r[c] = !(s[c] = p))
                    }
                } else
                    x = h(x === s ? x.splice(v, x.length) : x),
                    a ? a(null, s, x, l) : Y.apply(s, x)
            })
        }
        function v(e) {
            for (var t, n, r, i = e.length, o = x.relative[e[0].type], a = o || x.relative[" "], s = o ? 1 : 0, u = p(function(e) {
                return e === t
            }, a, !0), l = p(function(e) {
                return -1 < J(t, e)
            }, a, !0), c = [function(e, n, r) {
                var i = !o && (r || n !== S) || ((t = n).nodeType ? u(e, n, r) : l(e, n, r));
                return t = null,
                i
            }
            ]; s < i; s++)
                if (n = x.relative[e[s].type])
                    c = [p(d(c), n)];
                else {
                    if ((n = x.filter[e[s].type].apply(null, e[s].matches))[R]) {
                        for (r = ++s; r < i && !x.relative[e[r].type]; r++)
                            ;
                        return g(1 < s && d(c), 1 < s && f(e.slice(0, s - 1).concat({
                            value: " " === e[s - 2].type ? "*" : ""
                        })).replace(ie, "$1"), n, s < r && v(e.slice(s, r)), r < i && v(e = e.slice(r)), r < i && f(e))
                    }
                    c.push(n)
                }
            return d(c)
        }
        var y, m, x, b, w, T, C, E, S, k, A, N, j, D, q, L, H, O, P, R = "sizzle" + 1 * new Date, M = e.document, I = 0, W = 0, F = n(), B = n(), $ = n(), _ = n(), z = function(e, t) {
            return e === t && (A = !0),
            0
        }, U = {}.hasOwnProperty, X = [], V = X.pop, G = X.push, Y = X.push, Q = X.slice, J = function(e, t) {
            for (var n = 0, r = e.length; n < r; n++)
                if (e[n] === t)
                    return n;
            return -1
        }, K = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", Z = "[\\x20\\t\\r\\n\\f]", ee = "(?:\\\\[\\da-fA-F]{1,6}" + Z + "?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+", te = "\\[" + Z + "*(" + ee + ")(?:" + Z + "*([*^$|!~]?=)" + Z + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + ee + "))|)" + Z + "*\\]", ne = ":(" + ee + ")(?:\\((('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|((?:\\\\.|[^\\\\()[\\]]|" + te + ")*)|.*)\\)|)", re = new RegExp(Z + "+","g"), ie = new RegExp("^" + Z + "+|((?:^|[^\\\\])(?:\\\\.)*)" + Z + "+$","g"), oe = new RegExp("^" + Z + "*," + Z + "*"), ae = new RegExp("^" + Z + "*([>+~]|" + Z + ")" + Z + "*"), se = new RegExp(Z + "|>"), ue = new RegExp(ne), le = new RegExp("^" + ee + "$"), ce = {
            ID: new RegExp("^#(" + ee + ")"),
            CLASS: new RegExp("^\\.(" + ee + ")"),
            TAG: new RegExp("^(" + ee + "|[*])"),
            ATTR: new RegExp("^" + te),
            PSEUDO: new RegExp("^" + ne),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + Z + "*(even|odd|(([+-]|)(\\d*)n|)" + Z + "*(?:([+-]|)" + Z + "*(\\d+)|))" + Z + "*\\)|)","i"),
            bool: new RegExp("^(?:" + K + ")$","i"),
            needsContext: new RegExp("^" + Z + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + Z + "*((?:-\\d)?\\d*)" + Z + "*\\)|)(?=[^-]|$)","i")
        }, fe = /HTML$/i, pe = /^(?:input|select|textarea|button)$/i, de = /^h\d$/i, he = /^[^{]+\{\s*\[native \w/, ge = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, ve = /[+~]/, ye = new RegExp("\\\\[\\da-fA-F]{1,6}" + Z + "?|\\\\([^\\r\\n\\f])","g"), me = function(e, t) {
            var n = "0x" + e.slice(1) - 65536;
            return t || (n < 0 ? String.fromCharCode(n + 65536) : String.fromCharCode(n >> 10 | 55296, 1023 & n | 56320))
        }, xe = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g, be = function(e, t) {
            return t ? "\0" === e ? "�" : e.slice(0, -1) + "\\" + e.charCodeAt(e.length - 1).toString(16) + " " : "\\" + e
        }, we = function() {
            N()
        }, Te = p(function(e) {
            return !0 === e.disabled && "fieldset" === e.nodeName.toLowerCase()
        }, {
            dir: "parentNode",
            next: "legend"
        });
        try {
            Y.apply(X = Q.call(M.childNodes), M.childNodes),
            X[M.childNodes.length].nodeType
        } catch (y) {
            Y = {
                apply: X.length ? function(e, t) {
                    G.apply(e, Q.call(t))
                }
                : function(e, t) {
                    for (var n = e.length, r = 0; e[n++] = t[r++]; )
                        ;
                    e.length = n - 1
                }
            }
        }
        for (y in m = t.support = {},
        w = t.isXML = function(e) {
            var t = e && e.namespaceURI
              , n = e && (e.ownerDocument || e).documentElement;
            return !fe.test(t || n && n.nodeName || "HTML")
        }
        ,
        N = t.setDocument = function(e) {
            var t, n, r = e ? e.ownerDocument || e : M;
            return r != j && 9 === r.nodeType && r.documentElement && (D = (j = r).documentElement,
            q = !w(j),
            M != j && (n = j.defaultView) && n.top !== n && (n.addEventListener ? n.addEventListener("unload", we, !1) : n.attachEvent && n.attachEvent("onunload", we)),
            m.scope = i(function(e) {
                return D.appendChild(e).appendChild(j.createElement("div")),
                void 0 !== e.querySelectorAll && !e.querySelectorAll(":scope fieldset div").length
            }),
            m.attributes = i(function(e) {
                return e.className = "i",
                !e.getAttribute("className")
            }),
            m.getElementsByTagName = i(function(e) {
                return e.appendChild(j.createComment("")),
                !e.getElementsByTagName("*").length
            }),
            m.getElementsByClassName = he.test(j.getElementsByClassName),
            m.getById = i(function(e) {
                return D.appendChild(e).id = R,
                !j.getElementsByName || !j.getElementsByName(R).length
            }),
            m.getById ? (x.filter.ID = function(e) {
                var t = e.replace(ye, me);
                return function(e) {
                    return e.getAttribute("id") === t
                }
            }
            ,
            x.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && q) {
                    var n = t.getElementById(e);
                    return n ? [n] : []
                }
            }
            ) : (x.filter.ID = function(e) {
                var t = e.replace(ye, me);
                return function(e) {
                    var n = void 0 !== e.getAttributeNode && e.getAttributeNode("id");
                    return n && n.value === t
                }
            }
            ,
            x.find.ID = function(e, t) {
                if (void 0 !== t.getElementById && q) {
                    var n, r, i, o = t.getElementById(e);
                    if (o) {
                        if ((n = o.getAttributeNode("id")) && n.value === e)
                            return [o];
                        for (i = t.getElementsByName(e),
                        r = 0; o = i[r++]; )
                            if ((n = o.getAttributeNode("id")) && n.value === e)
                                return [o]
                    }
                    return []
                }
            }
            ),
            x.find.TAG = m.getElementsByTagName ? function(e, t) {
                return void 0 !== t.getElementsByTagName ? t.getElementsByTagName(e) : m.qsa ? t.querySelectorAll(e) : void 0
            }
            : function(e, t) {
                var n, r = [], i = 0, o = t.getElementsByTagName(e);
                if ("*" === e) {
                    for (; n = o[i++]; )
                        1 === n.nodeType && r.push(n);
                    return r
                }
                return o
            }
            ,
            x.find.CLASS = m.getElementsByClassName && function(e, t) {
                if (void 0 !== t.getElementsByClassName && q)
                    return t.getElementsByClassName(e)
            }
            ,
            H = [],
            L = [],
            (m.qsa = he.test(j.querySelectorAll)) && (i(function(e) {
                var t;
                D.appendChild(e).innerHTML = "<a id='" + R + "'></a><select id='" + R + "-\r\\' msallowcapture=''><option selected=''></option></select>",
                e.querySelectorAll("[msallowcapture^='']").length && L.push("[*^$]=" + Z + "*(?:''|\"\")"),
                e.querySelectorAll("[selected]").length || L.push("\\[" + Z + "*(?:value|" + K + ")"),
                e.querySelectorAll("[id~=" + R + "-]").length || L.push("~="),
                (t = j.createElement("input")).setAttribute("name", ""),
                e.appendChild(t),
                e.querySelectorAll("[name='']").length || L.push("\\[" + Z + "*name" + Z + "*=" + Z + "*(?:''|\"\")"),
                e.querySelectorAll(":checked").length || L.push(":checked"),
                e.querySelectorAll("a#" + R + "+*").length || L.push(".#.+[+~]"),
                e.querySelectorAll("\\\f"),
                L.push("[\\r\\n\\f]")
            }),
            i(function(e) {
                e.innerHTML = "<a href='' disabled='disabled'></a><select disabled='disabled'><option/></select>";
                var t = j.createElement("input");
                t.setAttribute("type", "hidden"),
                e.appendChild(t).setAttribute("name", "D"),
                e.querySelectorAll("[name=d]").length && L.push("name" + Z + "*[*^$|!~]?="),
                2 !== e.querySelectorAll(":enabled").length && L.push(":enabled", ":disabled"),
                D.appendChild(e).disabled = !0,
                2 !== e.querySelectorAll(":disabled").length && L.push(":enabled", ":disabled"),
                e.querySelectorAll("*,:x"),
                L.push(",.*:")
            })),
            (m.matchesSelector = he.test(O = D.matches || D.webkitMatchesSelector || D.mozMatchesSelector || D.oMatchesSelector || D.msMatchesSelector)) && i(function(e) {
                m.disconnectedMatch = O.call(e, "*"),
                O.call(e, "[s!='']:x"),
                H.push("!=", ne)
            }),
            L = L.length && new RegExp(L.join("|")),
            H = H.length && new RegExp(H.join("|")),
            t = he.test(D.compareDocumentPosition),
            P = t || he.test(D.contains) ? function(e, t) {
                var n = 9 === e.nodeType ? e.documentElement : e
                  , r = t && t.parentNode;
                return e === r || !(!r || 1 !== r.nodeType || !(n.contains ? n.contains(r) : e.compareDocumentPosition && 16 & e.compareDocumentPosition(r)))
            }
            : function(e, t) {
                if (t)
                    for (; t = t.parentNode; )
                        if (t === e)
                            return !0;
                return !1
            }
            ,
            z = t ? function(e, t) {
                if (e === t)
                    return A = !0,
                    0;
                var n = !e.compareDocumentPosition - !t.compareDocumentPosition;
                return n || (1 & (n = (e.ownerDocument || e) == (t.ownerDocument || t) ? e.compareDocumentPosition(t) : 1) || !m.sortDetached && t.compareDocumentPosition(e) === n ? e == j || e.ownerDocument == M && P(M, e) ? -1 : t == j || t.ownerDocument == M && P(M, t) ? 1 : k ? J(k, e) - J(k, t) : 0 : 4 & n ? -1 : 1)
            }
            : function(e, t) {
                if (e === t)
                    return A = !0,
                    0;
                var n, r = 0, i = e.parentNode, o = t.parentNode, s = [e], u = [t];
                if (!i || !o)
                    return e == j ? -1 : t == j ? 1 : i ? -1 : o ? 1 : k ? J(k, e) - J(k, t) : 0;
                if (i === o)
                    return a(e, t);
                for (n = e; n = n.parentNode; )
                    s.unshift(n);
                for (n = t; n = n.parentNode; )
                    u.unshift(n);
                for (; s[r] === u[r]; )
                    r++;
                return r ? a(s[r], u[r]) : s[r] == M ? -1 : u[r] == M ? 1 : 0
            }
            ),
            j
        }
        ,
        t.matches = function(e, n) {
            return t(e, null, null, n)
        }
        ,
        t.matchesSelector = function(e, n) {
            if (N(e),
            m.matchesSelector && q && !_[n + " "] && (!H || !H.test(n)) && (!L || !L.test(n)))
                try {
                    var r = O.call(e, n);
                    if (r || m.disconnectedMatch || e.document && 11 !== e.document.nodeType)
                        return r
                } catch (e) {
                    _(n, !0)
                }
            return 0 < t(n, j, null, [e]).length
        }
        ,
        t.contains = function(e, t) {
            return (e.ownerDocument || e) != j && N(e),
            P(e, t)
        }
        ,
        t.attr = function(e, t) {
            (e.ownerDocument || e) != j && N(e);
            var n = x.attrHandle[t.toLowerCase()]
              , r = n && U.call(x.attrHandle, t.toLowerCase()) ? n(e, t, !q) : void 0;
            return void 0 !== r ? r : m.attributes || !q ? e.getAttribute(t) : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }
        ,
        t.escape = function(e) {
            return (e + "").replace(xe, be)
        }
        ,
        t.error = function(e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }
        ,
        t.uniqueSort = function(e) {
            var t, n = [], r = 0, i = 0;
            if (A = !m.detectDuplicates,
            k = !m.sortStable && e.slice(0),
            e.sort(z),
            A) {
                for (; t = e[i++]; )
                    t === e[i] && (r = n.push(i));
                for (; r--; )
                    e.splice(n[r], 1)
            }
            return k = null,
            e
        }
        ,
        b = t.getText = function(e) {
            var t, n = "", r = 0, i = e.nodeType;
            if (i) {
                if (1 === i || 9 === i || 11 === i) {
                    if ("string" == typeof e.textContent)
                        return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)
                        n += b(e)
                } else if (3 === i || 4 === i)
                    return e.nodeValue
            } else
                for (; t = e[r++]; )
                    n += b(t);
            return n
        }
        ,
        (x = t.selectors = {
            cacheLength: 50,
            createPseudo: r,
            match: ce,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: !0
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: !0
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(e) {
                    return e[1] = e[1].replace(ye, me),
                    e[3] = (e[3] || e[4] || e[5] || "").replace(ye, me),
                    "~=" === e[2] && (e[3] = " " + e[3] + " "),
                    e.slice(0, 4)
                },
                CHILD: function(e) {
                    return e[1] = e[1].toLowerCase(),
                    "nth" === e[1].slice(0, 3) ? (e[3] || t.error(e[0]),
                    e[4] = +(e[4] ? e[5] + (e[6] || 1) : 2 * ("even" === e[3] || "odd" === e[3])),
                    e[5] = +(e[7] + e[8] || "odd" === e[3])) : e[3] && t.error(e[0]),
                    e
                },
                PSEUDO: function(e) {
                    var t, n = !e[6] && e[2];
                    return ce.CHILD.test(e[0]) ? null : (e[3] ? e[2] = e[4] || e[5] || "" : n && ue.test(n) && (t = T(n, !0)) && (t = n.indexOf(")", n.length - t) - n.length) && (e[0] = e[0].slice(0, t),
                    e[2] = n.slice(0, t)),
                    e.slice(0, 3))
                }
            },
            filter: {
                TAG: function(e) {
                    var t = e.replace(ye, me).toLowerCase();
                    return "*" === e ? function() {
                        return !0
                    }
                    : function(e) {
                        return e.nodeName && e.nodeName.toLowerCase() === t
                    }
                },
                CLASS: function(e) {
                    var t = F[e + " "];
                    return t || (t = new RegExp("(^|" + Z + ")" + e + "(" + Z + "|$)")) && F(e, function(e) {
                        return t.test("string" == typeof e.className && e.className || void 0 !== e.getAttribute && e.getAttribute("class") || "")
                    })
                },
                ATTR: function(e, n, r) {
                    return function(i) {
                        var o = t.attr(i, e);
                        return null == o ? "!=" === n : !n || (o += "",
                        "=" === n ? o === r : "!=" === n ? o !== r : "^=" === n ? r && 0 === o.indexOf(r) : "*=" === n ? r && -1 < o.indexOf(r) : "$=" === n ? r && o.slice(-r.length) === r : "~=" === n ? -1 < (" " + o.replace(re, " ") + " ").indexOf(r) : "|=" === n && (o === r || o.slice(0, r.length + 1) === r + "-"))
                    }
                },
                CHILD: function(e, t, n, r, i) {
                    var o = "nth" !== e.slice(0, 3)
                      , a = "last" !== e.slice(-4)
                      , s = "of-type" === t;
                    return 1 === r && 0 === i ? function(e) {
                        return !!e.parentNode
                    }
                    : function(t, n, u) {
                        var l, c, f, p, d, h, g = o !== a ? "nextSibling" : "previousSibling", v = t.parentNode, y = s && t.nodeName.toLowerCase(), m = !u && !s, x = !1;
                        if (v) {
                            if (o) {
                                for (; g; ) {
                                    for (p = t; p = p[g]; )
                                        if (s ? p.nodeName.toLowerCase() === y : 1 === p.nodeType)
                                            return !1;
                                    h = g = "only" === e && !h && "nextSibling"
                                }
                                return !0
                            }
                            if (h = [a ? v.firstChild : v.lastChild],
                            a && m) {
                                for (x = (d = (l = (c = (f = (p = v)[R] || (p[R] = {}))[p.uniqueID] || (f[p.uniqueID] = {}))[e] || [])[0] === I && l[1]) && l[2],
                                p = d && v.childNodes[d]; p = ++d && p && p[g] || (x = d = 0) || h.pop(); )
                                    if (1 === p.nodeType && ++x && p === t) {
                                        c[e] = [I, d, x];
                                        break
                                    }
                            } else if (m && (x = d = (l = (c = (f = (p = t)[R] || (p[R] = {}))[p.uniqueID] || (f[p.uniqueID] = {}))[e] || [])[0] === I && l[1]),
                            !1 === x)
                                for (; (p = ++d && p && p[g] || (x = d = 0) || h.pop()) && ((s ? p.nodeName.toLowerCase() !== y : 1 !== p.nodeType) || !++x || (m && ((c = (f = p[R] || (p[R] = {}))[p.uniqueID] || (f[p.uniqueID] = {}))[e] = [I, x]),
                                p !== t)); )
                                    ;
                            return (x -= i) === r || x % r == 0 && 0 <= x / r
                        }
                    }
                },
                PSEUDO: function(e, n) {
                    var i, o = x.pseudos[e] || x.setFilters[e.toLowerCase()] || t.error("unsupported pseudo: " + e);
                    return o[R] ? o(n) : 1 < o.length ? (i = [e, e, "", n],
                    x.setFilters.hasOwnProperty(e.toLowerCase()) ? r(function(e, t) {
                        for (var r, i = o(e, n), a = i.length; a--; )
                            e[r = J(e, i[a])] = !(t[r] = i[a])
                    }) : function(e) {
                        return o(e, 0, i)
                    }
                    ) : o
                }
            },
            pseudos: {
                not: r(function(e) {
                    var t = []
                      , n = []
                      , i = C(e.replace(ie, "$1"));
                    return i[R] ? r(function(e, t, n, r) {
                        for (var o, a = i(e, null, r, []), s = e.length; s--; )
                            (o = a[s]) && (e[s] = !(t[s] = o))
                    }) : function(e, r, o) {
                        return t[0] = e,
                        i(t, null, o, n),
                        t[0] = null,
                        !n.pop()
                    }
                }),
                has: r(function(e) {
                    return function(n) {
                        return 0 < t(e, n).length
                    }
                }),
                contains: r(function(e) {
                    return e = e.replace(ye, me),
                    function(t) {
                        return -1 < (t.textContent || b(t)).indexOf(e)
                    }
                }),
                lang: r(function(e) {
                    return le.test(e || "") || t.error("unsupported lang: " + e),
                    e = e.replace(ye, me).toLowerCase(),
                    function(t) {
                        var n;
                        do {
                            if (n = q ? t.lang : t.getAttribute("xml:lang") || t.getAttribute("lang"))
                                return (n = n.toLowerCase()) === e || 0 === n.indexOf(e + "-")
                        } while ((t = t.parentNode) && 1 === t.nodeType);
                        return !1
                    }
                }),
                target: function(t) {
                    var n = e.location && e.location.hash;
                    return n && n.slice(1) === t.id
                },
                root: function(e) {
                    return e === D
                },
                focus: function(e) {
                    return e === j.activeElement && (!j.hasFocus || j.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
                },
                enabled: s(!1),
                disabled: s(!0),
                checked: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && !!e.checked || "option" === t && !!e.selected
                },
                selected: function(e) {
                    return e.parentNode && e.parentNode.selectedIndex,
                    !0 === e.selected
                },
                empty: function(e) {
                    for (e = e.firstChild; e; e = e.nextSibling)
                        if (e.nodeType < 6)
                            return !1;
                    return !0
                },
                parent: function(e) {
                    return !x.pseudos.empty(e)
                },
                header: function(e) {
                    return de.test(e.nodeName)
                },
                input: function(e) {
                    return pe.test(e.nodeName)
                },
                button: function(e) {
                    var t = e.nodeName.toLowerCase();
                    return "input" === t && "button" === e.type || "button" === t
                },
                text: function(e) {
                    var t;
                    return "input" === e.nodeName.toLowerCase() && "text" === e.type && (null == (t = e.getAttribute("type")) || "text" === t.toLowerCase())
                },
                first: u(function() {
                    return [0]
                }),
                last: u(function(e, t) {
                    return [t - 1]
                }),
                eq: u(function(e, t, n) {
                    return [n < 0 ? n + t : n]
                }),
                even: u(function(e, t) {
                    for (var n = 0; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                odd: u(function(e, t) {
                    for (var n = 1; n < t; n += 2)
                        e.push(n);
                    return e
                }),
                lt: u(function(e, t, n) {
                    for (var r = n < 0 ? n + t : t < n ? t : n; 0 <= --r; )
                        e.push(r);
                    return e
                }),
                gt: u(function(e, t, n) {
                    for (var r = n < 0 ? n + t : n; ++r < t; )
                        e.push(r);
                    return e
                })
            }
        }).pseudos.nth = x.pseudos.eq,
        {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        })
            x.pseudos[y] = function(e) {
                return function(t) {
                    return "input" === t.nodeName.toLowerCase() && t.type === e
                }
            }(y);
        for (y in {
            submit: !0,
            reset: !0
        })
            x.pseudos[y] = function(e) {
                return function(t) {
                    var n = t.nodeName.toLowerCase();
                    return ("input" === n || "button" === n) && t.type === e
                }
            }(y);
        return c.prototype = x.filters = x.pseudos,
        x.setFilters = new c,
        T = t.tokenize = function(e, n) {
            var r, i, o, a, s, u, l, c = B[e + " "];
            if (c)
                return n ? 0 : c.slice(0);
            for (s = e,
            u = [],
            l = x.preFilter; s; ) {
                for (a in r && !(i = oe.exec(s)) || (i && (s = s.slice(i[0].length) || s),
                u.push(o = [])),
                r = !1,
                (i = ae.exec(s)) && (r = i.shift(),
                o.push({
                    value: r,
                    type: i[0].replace(ie, " ")
                }),
                s = s.slice(r.length)),
                x.filter)
                    !(i = ce[a].exec(s)) || l[a] && !(i = l[a](i)) || (r = i.shift(),
                    o.push({
                        value: r,
                        type: a,
                        matches: i
                    }),
                    s = s.slice(r.length));
                if (!r)
                    break
            }
            return n ? s.length : s ? t.error(e) : B(e, u).slice(0)
        }
        ,
        C = t.compile = function(e, n) {
            var i, o, a, s, u, l, c = [], f = [], p = $[e + " "];
            if (!p) {
                for (n || (n = T(e)),
                i = n.length; i--; )
                    (p = v(n[i]))[R] ? c.push(p) : f.push(p);
                (p = $(e, (o = f,
                s = 0 < (a = c).length,
                u = 0 < o.length,
                l = function(e, n, r, i, l) {
                    var c, f, p, d = 0, g = "0", v = e && [], y = [], m = S, b = e || u && x.find.TAG("*", l), w = I += null == m ? 1 : Math.random() || .1, T = b.length;
                    for (l && (S = n == j || n || l); g !== T && null != (c = b[g]); g++) {
                        if (u && c) {
                            for (f = 0,
                            n || c.ownerDocument == j || (N(c),
                            r = !q); p = o[f++]; )
                                if (p(c, n || j, r)) {
                                    i.push(c);
                                    break
                                }
                            l && (I = w)
                        }
                        s && ((c = !p && c) && d--,
                        e && v.push(c))
                    }
                    if (d += g,
                    s && g !== d) {
                        for (f = 0; p = a[f++]; )
                            p(v, y, n, r);
                        if (e) {
                            if (0 < d)
                                for (; g--; )
                                    v[g] || y[g] || (y[g] = V.call(i));
                            y = h(y)
                        }
                        Y.apply(i, y),
                        l && !e && 0 < y.length && 1 < d + a.length && t.uniqueSort(i)
                    }
                    return l && (I = w,
                    S = m),
                    v
                }
                ,
                s ? r(l) : l))).selector = e
            }
            return p
        }
        ,
        E = t.select = function(e, t, n, r) {
            var i, o, a, s, u, c = "function" == typeof e && e, p = !r && T(e = c.selector || e);
            if (n = n || [],
            1 === p.length) {
                if (2 < (o = p[0] = p[0].slice(0)).length && "ID" === (a = o[0]).type && 9 === t.nodeType && q && x.relative[o[1].type]) {
                    if (!(t = (x.find.ID(a.matches[0].replace(ye, me), t) || [])[0]))
                        return n;
                    c && (t = t.parentNode),
                    e = e.slice(o.shift().value.length)
                }
                for (i = ce.needsContext.test(e) ? 0 : o.length; i-- && (a = o[i],
                !x.relative[s = a.type]); )
                    if ((u = x.find[s]) && (r = u(a.matches[0].replace(ye, me), ve.test(o[0].type) && l(t.parentNode) || t))) {
                        if (o.splice(i, 1),
                        !(e = r.length && f(o)))
                            return Y.apply(n, r),
                            n;
                        break
                    }
            }
            return (c || C(e, p))(r, t, !q, n, !t || ve.test(e) && l(t.parentNode) || t),
            n
        }
        ,
        m.sortStable = R.split("").sort(z).join("") === R,
        m.detectDuplicates = !!A,
        N(),
        m.sortDetached = i(function(e) {
            return 1 & e.compareDocumentPosition(j.createElement("fieldset"))
        }),
        i(function(e) {
            return e.innerHTML = "<a href='#'></a>",
            "#" === e.firstChild.getAttribute("href")
        }) || o("type|href|height|width", function(e, t, n) {
            if (!n)
                return e.getAttribute(t, "type" === t.toLowerCase() ? 1 : 2)
        }),
        m.attributes && i(function(e) {
            return e.innerHTML = "<input/>",
            e.firstChild.setAttribute("value", ""),
            "" === e.firstChild.getAttribute("value")
        }) || o("value", function(e, t, n) {
            if (!n && "input" === e.nodeName.toLowerCase())
                return e.defaultValue
        }),
        i(function(e) {
            return null == e.getAttribute("disabled")
        }) || o(K, function(e, t, n) {
            var r;
            if (!n)
                return !0 === e[t] ? t.toLowerCase() : (r = e.getAttributeNode(t)) && r.specified ? r.value : null
        }),
        t
    }(e);
    he.find = ge,
    he.expr = ge.selectors,
    he.expr[":"] = he.expr.pseudos,
    he.uniqueSort = he.unique = ge.uniqueSort,
    he.text = ge.getText,
    he.isXMLDoc = ge.isXML,
    he.contains = ge.contains,
    he.escapeSelector = ge.escape;
    var ve = function(e, t, n) {
        for (var r = [], i = void 0 !== n; (e = e[t]) && 9 !== e.nodeType; )
            if (1 === e.nodeType) {
                if (i && he(e).is(n))
                    break;
                r.push(e)
            }
        return r
    }
      , ye = function(e, t) {
        for (var n = []; e; e = e.nextSibling)
            1 === e.nodeType && e !== t && n.push(e);
        return n
    }
      , me = he.expr.match.needsContext
      , xe = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
    he.filter = function(e, t, n) {
        var r = t[0];
        return n && (e = ":not(" + e + ")"),
        1 === t.length && 1 === r.nodeType ? he.find.matchesSelector(r, e) ? [r] : [] : he.find.matches(e, he.grep(t, function(e) {
            return 1 === e.nodeType
        }))
    }
    ,
    he.fn.extend({
        find: function(e) {
            var t, n, r = this.length, i = this;
            if ("string" != typeof e)
                return this.pushStack(he(e).filter(function() {
                    for (t = 0; t < r; t++)
                        if (he.contains(i[t], this))
                            return !0
                }));
            for (n = this.pushStack([]),
            t = 0; t < r; t++)
                he.find(e, i[t], n);
            return 1 < r ? he.uniqueSort(n) : n
        },
        filter: function(e) {
            return this.pushStack(a(this, e || [], !1))
        },
        not: function(e) {
            return this.pushStack(a(this, e || [], !0))
        },
        is: function(e) {
            return !!a(this, "string" == typeof e && me.test(e) ? he(e) : e || [], !1).length
        }
    });
    var be, we = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
    (he.fn.init = function(e, t, n) {
        var r, i;
        if (!e)
            return this;
        if (n = n || be,
        "string" == typeof e) {
            if (!(r = "<" === e[0] && ">" === e[e.length - 1] && 3 <= e.length ? [null, e, null] : we.exec(e)) || !r[1] && t)
                return !t || t.jquery ? (t || n).find(e) : this.constructor(t).find(e);
            if (r[1]) {
                if (t = t instanceof he ? t[0] : t,
                he.merge(this, he.parseHTML(r[1], t && t.nodeType ? t.ownerDocument || t : fe, !0)),
                xe.test(r[1]) && he.isPlainObject(t))
                    for (r in t)
                        le(this[r]) ? this[r](t[r]) : this.attr(r, t[r]);
                return this
            }
            return (i = fe.getElementById(r[2])) && (this[0] = i,
            this.length = 1),
            this
        }
        return e.nodeType ? (this[0] = e,
        this.length = 1,
        this) : le(e) ? void 0 !== n.ready ? n.ready(e) : e(he) : he.makeArray(e, this)
    }
    ).prototype = he.fn,
    be = he(fe);
    var Te = /^(?:parents|prev(?:Until|All))/
      , Ce = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
    he.fn.extend({
        has: function(e) {
            var t = he(e, this)
              , n = t.length;
            return this.filter(function() {
                for (var e = 0; e < n; e++)
                    if (he.contains(this, t[e]))
                        return !0
            })
        },
        closest: function(e, t) {
            var n, r = 0, i = this.length, o = [], a = "string" != typeof e && he(e);
            if (!me.test(e))
                for (; r < i; r++)
                    for (n = this[r]; n && n !== t; n = n.parentNode)
                        if (n.nodeType < 11 && (a ? -1 < a.index(n) : 1 === n.nodeType && he.find.matchesSelector(n, e))) {
                            o.push(n);
                            break
                        }
            return this.pushStack(1 < o.length ? he.uniqueSort(o) : o)
        },
        index: function(e) {
            return e ? "string" == typeof e ? ne.call(he(e), this[0]) : ne.call(this, e.jquery ? e[0] : e) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
        },
        add: function(e, t) {
            return this.pushStack(he.uniqueSort(he.merge(this.get(), he(e, t))))
        },
        addBack: function(e) {
            return this.add(null == e ? this.prevObject : this.prevObject.filter(e))
        }
    }),
    he.each({
        parent: function(e) {
            var t = e.parentNode;
            return t && 11 !== t.nodeType ? t : null
        },
        parents: function(e) {
            return ve(e, "parentNode")
        },
        parentsUntil: function(e, t, n) {
            return ve(e, "parentNode", n)
        },
        next: function(e) {
            return s(e, "nextSibling")
        },
        prev: function(e) {
            return s(e, "previousSibling")
        },
        nextAll: function(e) {
            return ve(e, "nextSibling")
        },
        prevAll: function(e) {
            return ve(e, "previousSibling")
        },
        nextUntil: function(e, t, n) {
            return ve(e, "nextSibling", n)
        },
        prevUntil: function(e, t, n) {
            return ve(e, "previousSibling", n)
        },
        siblings: function(e) {
            return ye((e.parentNode || {}).firstChild, e)
        },
        children: function(e) {
            return ye(e.firstChild)
        },
        contents: function(e) {
            return null != e.contentDocument && K(e.contentDocument) ? e.contentDocument : (o(e, "template") && (e = e.content || e),
            he.merge([], e.childNodes))
        }
    }, function(e, t) {
        he.fn[e] = function(n, r) {
            var i = he.map(this, t, n);
            return "Until" !== e.slice(-5) && (r = n),
            r && "string" == typeof r && (i = he.filter(r, i)),
            1 < this.length && (Ce[e] || he.uniqueSort(i),
            Te.test(e) && i.reverse()),
            this.pushStack(i)
        }
    });
    var Ee = /[^\x20\t\r\n\f]+/g;
    he.Callbacks = function(e) {
        var t, n;
        e = "string" == typeof e ? (t = e,
        n = {},
        he.each(t.match(Ee) || [], function(e, t) {
            n[t] = !0
        }),
        n) : he.extend({}, e);
        var i, o, a, s, u = [], l = [], c = -1, f = function() {
            for (s = s || e.once,
            a = i = !0; l.length; c = -1)
                for (o = l.shift(); ++c < u.length; )
                    !1 === u[c].apply(o[0], o[1]) && e.stopOnFalse && (c = u.length,
                    o = !1);
            e.memory || (o = !1),
            i = !1,
            s && (u = o ? [] : "")
        }, p = {
            add: function() {
                return u && (o && !i && (c = u.length - 1,
                l.push(o)),
                function t(n) {
                    he.each(n, function(n, i) {
                        le(i) ? e.unique && p.has(i) || u.push(i) : i && i.length && "string" !== r(i) && t(i)
                    })
                }(arguments),
                o && !i && f()),
                this
            },
            remove: function() {
                return he.each(arguments, function(e, t) {
                    for (var n; -1 < (n = he.inArray(t, u, n)); )
                        u.splice(n, 1),
                        n <= c && c--
                }),
                this
            },
            has: function(e) {
                return e ? -1 < he.inArray(e, u) : 0 < u.length
            },
            empty: function() {
                return u && (u = []),
                this
            },
            disable: function() {
                return s = l = [],
                u = o = "",
                this
            },
            disabled: function() {
                return !u
            },
            lock: function() {
                return s = l = [],
                o || i || (u = o = ""),
                this
            },
            locked: function() {
                return !!s
            },
            fireWith: function(e, t) {
                return s || (t = [e, (t = t || []).slice ? t.slice() : t],
                l.push(t),
                i || f()),
                this
            },
            fire: function() {
                return p.fireWith(this, arguments),
                this
            },
            fired: function() {
                return !!a
            }
        };
        return p
    }
    ,
    he.extend({
        Deferred: function(t) {
            var n = [["notify", "progress", he.Callbacks("memory"), he.Callbacks("memory"), 2], ["resolve", "done", he.Callbacks("once memory"), he.Callbacks("once memory"), 0, "resolved"], ["reject", "fail", he.Callbacks("once memory"), he.Callbacks("once memory"), 1, "rejected"]]
              , r = "pending"
              , i = {
                state: function() {
                    return r
                },
                always: function() {
                    return o.done(arguments).fail(arguments),
                    this
                },
                catch: function(e) {
                    return i.then(null, e)
                },
                pipe: function() {
                    var e = arguments;
                    return he.Deferred(function(t) {
                        he.each(n, function(n, r) {
                            var i = le(e[r[4]]) && e[r[4]];
                            o[r[1]](function() {
                                var e = i && i.apply(this, arguments);
                                e && le(e.promise) ? e.promise().progress(t.notify).done(t.resolve).fail(t.reject) : t[r[0] + "With"](this, i ? [e] : arguments)
                            })
                        }),
                        e = null
                    }).promise()
                },
                then: function(t, r, i) {
                    function o(t, n, r, i) {
                        return function() {
                            var s = this
                              , c = arguments
                              , f = function() {
                                var e, f;
                                if (!(t < a)) {
                                    if ((e = r.apply(s, c)) === n.promise())
                                        throw new TypeError("Thenable self-resolution");
                                    f = e && ("object" == typeof e || "function" == typeof e) && e.then,
                                    le(f) ? i ? f.call(e, o(a, n, u, i), o(a, n, l, i)) : (a++,
                                    f.call(e, o(a, n, u, i), o(a, n, l, i), o(a, n, u, n.notifyWith))) : (r !== u && (s = void 0,
                                    c = [e]),
                                    (i || n.resolveWith)(s, c))
                                }
                            }
                              , p = i ? f : function() {
                                try {
                                    f()
                                } catch (e) {
                                    he.Deferred.exceptionHook && he.Deferred.exceptionHook(e, p.stackTrace),
                                    a <= t + 1 && (r !== l && (s = void 0,
                                    c = [e]),
                                    n.rejectWith(s, c))
                                }
                            }
                            ;
                            t ? p() : (he.Deferred.getStackHook && (p.stackTrace = he.Deferred.getStackHook()),
                            e.setTimeout(p))
                        }
                    }
                    var a = 0;
                    return he.Deferred(function(e) {
                        n[0][3].add(o(0, e, le(i) ? i : u, e.notifyWith)),
                        n[1][3].add(o(0, e, le(t) ? t : u)),
                        n[2][3].add(o(0, e, le(r) ? r : l))
                    }).promise()
                },
                promise: function(e) {
                    return null != e ? he.extend(e, i) : i
                }
            }
              , o = {};
            return he.each(n, function(e, t) {
                var a = t[2]
                  , s = t[5];
                i[t[1]] = a.add,
                s && a.add(function() {
                    r = s
                }, n[3 - e][2].disable, n[3 - e][3].disable, n[0][2].lock, n[0][3].lock),
                a.add(t[3].fire),
                o[t[0]] = function() {
                    return o[t[0] + "With"](this === o ? void 0 : this, arguments),
                    this
                }
                ,
                o[t[0] + "With"] = a.fireWith
            }),
            i.promise(o),
            t && t.call(o, o),
            o
        },
        when: function(e) {
            var t = arguments.length
              , n = t
              , r = Array(n)
              , i = Z.call(arguments)
              , o = he.Deferred()
              , a = function(e) {
                return function(n) {
                    r[e] = this,
                    i[e] = 1 < arguments.length ? Z.call(arguments) : n,
                    --t || o.resolveWith(r, i)
                }
            };
            if (t <= 1 && (c(e, o.done(a(n)).resolve, o.reject, !t),
            "pending" === o.state() || le(i[n] && i[n].then)))
                return o.then();
            for (; n--; )
                c(i[n], a(n), o.reject);
            return o.promise()
        }
    });
    var Se = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;
    he.Deferred.exceptionHook = function(t, n) {
        e.console && e.console.warn && t && Se.test(t.name) && e.console.warn("jQuery.Deferred exception: " + t.message, t.stack, n)
    }
    ,
    he.readyException = function(t) {
        e.setTimeout(function() {
            throw t
        })
    }
    ;
    var ke = he.Deferred();
    he.fn.ready = function(e) {
        return ke.then(e).catch(function(e) {
            he.readyException(e)
        }),
        this
    }
    ,
    he.extend({
        isReady: !1,
        readyWait: 1,
        ready: function(e) {
            (!0 === e ? --he.readyWait : he.isReady) || (he.isReady = !0) !== e && 0 < --he.readyWait || ke.resolveWith(fe, [he])
        }
    }),
    he.ready.then = ke.then,
    "complete" === fe.readyState || "loading" !== fe.readyState && !fe.documentElement.doScroll ? e.setTimeout(he.ready) : (fe.addEventListener("DOMContentLoaded", f),
    e.addEventListener("load", f));
    var Ae = function(e, t, n, i, o, a, s) {
        var u = 0
          , l = e.length
          , c = null == n;
        if ("object" === r(n))
            for (u in o = !0,
            n)
                Ae(e, t, u, n[u], !0, a, s);
        else if (void 0 !== i && (o = !0,
        le(i) || (s = !0),
        c && (s ? (t.call(e, i),
        t = null) : (c = t,
        t = function(e, t, n) {
            return c.call(he(e), n)
        }
        )),
        t))
            for (; u < l; u++)
                t(e[u], n, s ? i : i.call(e[u], u, t(e[u], n)));
        return o ? e : c ? t.call(e) : l ? t(e[0], n) : a
    }
      , Ne = /^-ms-/
      , je = /-([a-z])/g
      , De = function(e) {
        return 1 === e.nodeType || 9 === e.nodeType || !+e.nodeType
    };
    h.uid = 1,
    h.prototype = {
        cache: function(e) {
            var t = e[this.expando];
            return t || (t = {},
            De(e) && (e.nodeType ? e[this.expando] = t : Object.defineProperty(e, this.expando, {
                value: t,
                configurable: !0
            }))),
            t
        },
        set: function(e, t, n) {
            var r, i = this.cache(e);
            if ("string" == typeof t)
                i[d(t)] = n;
            else
                for (r in t)
                    i[d(r)] = t[r];
            return i
        },
        get: function(e, t) {
            return void 0 === t ? this.cache(e) : e[this.expando] && e[this.expando][d(t)]
        },
        access: function(e, t, n) {
            return void 0 === t || t && "string" == typeof t && void 0 === n ? this.get(e, t) : (this.set(e, t, n),
            void 0 !== n ? n : t)
        },
        remove: function(e, t) {
            var n, r = e[this.expando];
            if (void 0 !== r) {
                if (void 0 !== t) {
                    n = (t = Array.isArray(t) ? t.map(d) : (t = d(t))in r ? [t] : t.match(Ee) || []).length;
                    for (; n--; )
                        delete r[t[n]]
                }
                (void 0 === t || he.isEmptyObject(r)) && (e.nodeType ? e[this.expando] = void 0 : delete e[this.expando])
            }
        },
        hasData: function(e) {
            var t = e[this.expando];
            return void 0 !== t && !he.isEmptyObject(t)
        }
    };
    var qe = new h
      , Le = new h
      , He = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/
      , Oe = /[A-Z]/g;
    he.extend({
        hasData: function(e) {
            return Le.hasData(e) || qe.hasData(e)
        },
        data: function(e, t, n) {
            return Le.access(e, t, n)
        },
        removeData: function(e, t) {
            Le.remove(e, t)
        },
        _data: function(e, t, n) {
            return qe.access(e, t, n)
        },
        _removeData: function(e, t) {
            qe.remove(e, t)
        }
    }),
    he.fn.extend({
        data: function(e, t) {
            var n, r, i, o = this[0], a = o && o.attributes;
            if (void 0 === e) {
                if (this.length && (i = Le.get(o),
                1 === o.nodeType && !qe.get(o, "hasDataAttrs"))) {
                    for (n = a.length; n--; )
                        a[n] && 0 === (r = a[n].name).indexOf("data-") && (r = d(r.slice(5)),
                        g(o, r, i[r]));
                    qe.set(o, "hasDataAttrs", !0)
                }
                return i
            }
            return "object" == typeof e ? this.each(function() {
                Le.set(this, e)
            }) : Ae(this, function(t) {
                var n;
                if (o && void 0 === t)
                    return void 0 !== (n = Le.get(o, e)) ? n : void 0 !== (n = g(o, e)) ? n : void 0;
                this.each(function() {
                    Le.set(this, e, t)
                })
            }, null, t, 1 < arguments.length, null, !0)
        },
        removeData: function(e) {
            return this.each(function() {
                Le.remove(this, e)
            })
        }
    }),
    he.extend({
        queue: function(e, t, n) {
            var r;
            if (e)
                return t = (t || "fx") + "queue",
                r = qe.get(e, t),
                n && (!r || Array.isArray(n) ? r = qe.access(e, t, he.makeArray(n)) : r.push(n)),
                r || []
        },
        dequeue: function(e, t) {
            t = t || "fx";
            var n = he.queue(e, t)
              , r = n.length
              , i = n.shift()
              , o = he._queueHooks(e, t);
            "inprogress" === i && (i = n.shift(),
            r--),
            i && ("fx" === t && n.unshift("inprogress"),
            delete o.stop,
            i.call(e, function() {
                he.dequeue(e, t)
            }, o)),
            !r && o && o.empty.fire()
        },
        _queueHooks: function(e, t) {
            var n = t + "queueHooks";
            return qe.get(e, n) || qe.access(e, n, {
                empty: he.Callbacks("once memory").add(function() {
                    qe.remove(e, [t + "queue", n])
                })
            })
        }
    }),
    he.fn.extend({
        queue: function(e, t) {
            var n = 2;
            return "string" != typeof e && (t = e,
            e = "fx",
            n--),
            arguments.length < n ? he.queue(this[0], e) : void 0 === t ? this : this.each(function() {
                var n = he.queue(this, e, t);
                he._queueHooks(this, e),
                "fx" === e && "inprogress" !== n[0] && he.dequeue(this, e)
            })
        },
        dequeue: function(e) {
            return this.each(function() {
                he.dequeue(this, e)
            })
        },
        clearQueue: function(e) {
            return this.queue(e || "fx", [])
        },
        promise: function(e, t) {
            var n, r = 1, i = he.Deferred(), o = this, a = this.length, s = function() {
                --r || i.resolveWith(o, [o])
            };
            for ("string" != typeof e && (t = e,
            e = void 0),
            e = e || "fx"; a--; )
                (n = qe.get(o[a], e + "queueHooks")) && n.empty && (r++,
                n.empty.add(s));
            return s(),
            i.promise(t)
        }
    });
    var Pe = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source
      , Re = new RegExp("^(?:([+-])=|)(" + Pe + ")([a-z%]*)$","i")
      , Me = ["Top", "Right", "Bottom", "Left"]
      , Ie = fe.documentElement
      , We = function(e) {
        return he.contains(e.ownerDocument, e)
    }
      , Fe = {
        composed: !0
    };
    Ie.getRootNode && (We = function(e) {
        return he.contains(e.ownerDocument, e) || e.getRootNode(Fe) === e.ownerDocument
    }
    );
    var Be = function(e, t) {
        return "none" === (e = t || e).style.display || "" === e.style.display && We(e) && "none" === he.css(e, "display")
    }
      , $e = {};
    he.fn.extend({
        show: function() {
            return y(this, !0)
        },
        hide: function() {
            return y(this)
        },
        toggle: function(e) {
            return "boolean" == typeof e ? e ? this.show() : this.hide() : this.each(function() {
                Be(this) ? he(this).show() : he(this).hide()
            })
        }
    });
    var _e, ze, Ue = /^(?:checkbox|radio)$/i, Xe = /<([a-z][^\/\0>\x20\t\r\n\f]*)/i, Ve = /^$|^module$|\/(?:java|ecma)script/i;
    _e = fe.createDocumentFragment().appendChild(fe.createElement("div")),
    (ze = fe.createElement("input")).setAttribute("type", "radio"),
    ze.setAttribute("checked", "checked"),
    ze.setAttribute("name", "t"),
    _e.appendChild(ze),
    ue.checkClone = _e.cloneNode(!0).cloneNode(!0).lastChild.checked,
    _e.innerHTML = "<textarea>x</textarea>",
    ue.noCloneChecked = !!_e.cloneNode(!0).lastChild.defaultValue,
    _e.innerHTML = "<option></option>",
    ue.option = !!_e.lastChild;
    var Ge = {
        thead: [1, "<table>", "</table>"],
        col: [2, "<table><colgroup>", "</colgroup></table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: [0, "", ""]
    };
    Ge.tbody = Ge.tfoot = Ge.colgroup = Ge.caption = Ge.thead,
    Ge.th = Ge.td,
    ue.option || (Ge.optgroup = Ge.option = [1, "<select multiple='multiple'>", "</select>"]);
    var Ye = /<|&#?\w+;/
      , Qe = /^([^.]*)(?:\.(.+)|)/;
    he.event = {
        global: {},
        add: function(e, t, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h, g, v = qe.get(e);
            if (De(e))
                for (n.handler && (n = (o = n).handler,
                i = o.selector),
                i && he.find.matchesSelector(Ie, i),
                n.guid || (n.guid = he.guid++),
                (u = v.events) || (u = v.events = Object.create(null)),
                (a = v.handle) || (a = v.handle = function(t) {
                    return void 0 !== he && he.event.triggered !== t.type ? he.event.dispatch.apply(e, arguments) : void 0
                }
                ),
                l = (t = (t || "").match(Ee) || [""]).length; l--; )
                    d = g = (s = Qe.exec(t[l]) || [])[1],
                    h = (s[2] || "").split(".").sort(),
                    d && (f = he.event.special[d] || {},
                    d = (i ? f.delegateType : f.bindType) || d,
                    f = he.event.special[d] || {},
                    c = he.extend({
                        type: d,
                        origType: g,
                        data: r,
                        handler: n,
                        guid: n.guid,
                        selector: i,
                        needsContext: i && he.expr.match.needsContext.test(i),
                        namespace: h.join(".")
                    }, o),
                    (p = u[d]) || ((p = u[d] = []).delegateCount = 0,
                    f.setup && !1 !== f.setup.call(e, r, h, a) || e.addEventListener && e.addEventListener(d, a)),
                    f.add && (f.add.call(e, c),
                    c.handler.guid || (c.handler.guid = n.guid)),
                    i ? p.splice(p.delegateCount++, 0, c) : p.push(c),
                    he.event.global[d] = !0)
        },
        remove: function(e, t, n, r, i) {
            var o, a, s, u, l, c, f, p, d, h, g, v = qe.hasData(e) && qe.get(e);
            if (v && (u = v.events)) {
                for (l = (t = (t || "").match(Ee) || [""]).length; l--; )
                    if (d = g = (s = Qe.exec(t[l]) || [])[1],
                    h = (s[2] || "").split(".").sort(),
                    d) {
                        for (f = he.event.special[d] || {},
                        p = u[d = (r ? f.delegateType : f.bindType) || d] || [],
                        s = s[2] && new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.|)") + "(\\.|$)"),
                        a = o = p.length; o--; )
                            c = p[o],
                            !i && g !== c.origType || n && n.guid !== c.guid || s && !s.test(c.namespace) || r && r !== c.selector && ("**" !== r || !c.selector) || (p.splice(o, 1),
                            c.selector && p.delegateCount--,
                            f.remove && f.remove.call(e, c));
                        a && !p.length && (f.teardown && !1 !== f.teardown.call(e, h, v.handle) || he.removeEvent(e, d, v.handle),
                        delete u[d])
                    } else
                        for (d in u)
                            he.event.remove(e, d + t[l], n, r, !0);
                he.isEmptyObject(u) && qe.remove(e, "handle events")
            }
        },
        dispatch: function(e) {
            var t, n, r, i, o, a, s = new Array(arguments.length), u = he.event.fix(e), l = (qe.get(this, "events") || Object.create(null))[u.type] || [], c = he.event.special[u.type] || {};
            for (s[0] = u,
            t = 1; t < arguments.length; t++)
                s[t] = arguments[t];
            if (u.delegateTarget = this,
            !c.preDispatch || !1 !== c.preDispatch.call(this, u)) {
                for (a = he.event.handlers.call(this, u, l),
                t = 0; (i = a[t++]) && !u.isPropagationStopped(); )
                    for (u.currentTarget = i.elem,
                    n = 0; (o = i.handlers[n++]) && !u.isImmediatePropagationStopped(); )
                        u.rnamespace && !1 !== o.namespace && !u.rnamespace.test(o.namespace) || (u.handleObj = o,
                        u.data = o.data,
                        void 0 !== (r = ((he.event.special[o.origType] || {}).handle || o.handler).apply(i.elem, s)) && !1 === (u.result = r) && (u.preventDefault(),
                        u.stopPropagation()));
                return c.postDispatch && c.postDispatch.call(this, u),
                u.result
            }
        },
        handlers: function(e, t) {
            var n, r, i, o, a, s = [], u = t.delegateCount, l = e.target;
            if (u && l.nodeType && !("click" === e.type && 1 <= e.button))
                for (; l !== this; l = l.parentNode || this)
                    if (1 === l.nodeType && ("click" !== e.type || !0 !== l.disabled)) {
                        for (o = [],
                        a = {},
                        n = 0; n < u; n++)
                            void 0 === a[i = (r = t[n]).selector + " "] && (a[i] = r.needsContext ? -1 < he(i, this).index(l) : he.find(i, this, null, [l]).length),
                            a[i] && o.push(r);
                        o.length && s.push({
                            elem: l,
                            handlers: o
                        })
                    }
            return l = this,
            u < t.length && s.push({
                elem: l,
                handlers: t.slice(u)
            }),
            s
        },
        addProp: function(e, t) {
            Object.defineProperty(he.Event.prototype, e, {
                enumerable: !0,
                configurable: !0,
                get: le(t) ? function() {
                    if (this.originalEvent)
                        return t(this.originalEvent)
                }
                : function() {
                    if (this.originalEvent)
                        return this.originalEvent[e]
                }
                ,
                set: function(t) {
                    Object.defineProperty(this, e, {
                        enumerable: !0,
                        configurable: !0,
                        writable: !0,
                        value: t
                    })
                }
            })
        },
        fix: function(e) {
            return e[he.expando] ? e : new he.Event(e)
        },
        special: {
            load: {
                noBubble: !0
            },
            click: {
                setup: function(e) {
                    var t = this || e;
                    return Ue.test(t.type) && t.click && o(t, "input") && S(t, "click", w),
                    !1
                },
                trigger: function(e) {
                    var t = this || e;
                    return Ue.test(t.type) && t.click && o(t, "input") && S(t, "click"),
                    !0
                },
                _default: function(e) {
                    var t = e.target;
                    return Ue.test(t.type) && t.click && o(t, "input") && qe.get(t, "click") || o(t, "a")
                }
            },
            beforeunload: {
                postDispatch: function(e) {
                    void 0 !== e.result && e.originalEvent && (e.originalEvent.returnValue = e.result)
                }
            }
        }
    },
    he.removeEvent = function(e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n)
    }
    ,
    he.Event = function(e, t) {
        if (!(this instanceof he.Event))
            return new he.Event(e,t);
        e && e.type ? (this.originalEvent = e,
        this.type = e.type,
        this.isDefaultPrevented = e.defaultPrevented || void 0 === e.defaultPrevented && !1 === e.returnValue ? w : T,
        this.target = e.target && 3 === e.target.nodeType ? e.target.parentNode : e.target,
        this.currentTarget = e.currentTarget,
        this.relatedTarget = e.relatedTarget) : this.type = e,
        t && he.extend(this, t),
        this.timeStamp = e && e.timeStamp || Date.now(),
        this[he.expando] = !0
    }
    ,
    he.Event.prototype = {
        constructor: he.Event,
        isDefaultPrevented: T,
        isPropagationStopped: T,
        isImmediatePropagationStopped: T,
        isSimulated: !1,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = w,
            e && !this.isSimulated && e.preventDefault()
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = w,
            e && !this.isSimulated && e.stopPropagation()
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = w,
            e && !this.isSimulated && e.stopImmediatePropagation(),
            this.stopPropagation()
        }
    },
    he.each({
        altKey: !0,
        bubbles: !0,
        cancelable: !0,
        changedTouches: !0,
        ctrlKey: !0,
        detail: !0,
        eventPhase: !0,
        metaKey: !0,
        pageX: !0,
        pageY: !0,
        shiftKey: !0,
        view: !0,
        char: !0,
        code: !0,
        charCode: !0,
        key: !0,
        keyCode: !0,
        button: !0,
        buttons: !0,
        clientX: !0,
        clientY: !0,
        offsetX: !0,
        offsetY: !0,
        pointerId: !0,
        pointerType: !0,
        screenX: !0,
        screenY: !0,
        targetTouches: !0,
        toElement: !0,
        touches: !0,
        which: !0
    }, he.event.addProp),
    he.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        he.event.special[e] = {
            setup: function() {
                return S(this, e, C),
                !1
            },
            trigger: function() {
                return S(this, e),
                !0
            },
            _default: function() {
                return !0
            },
            delegateType: t
        }
    }),
    he.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(e, t) {
        he.event.special[e] = {
            delegateType: t,
            bindType: t,
            handle: function(e) {
                var n, r = e.relatedTarget, i = e.handleObj;
                return r && (r === this || he.contains(this, r)) || (e.type = i.origType,
                n = i.handler.apply(this, arguments),
                e.type = t),
                n
            }
        }
    }),
    he.fn.extend({
        on: function(e, t, n, r) {
            return E(this, e, t, n, r)
        },
        one: function(e, t, n, r) {
            return E(this, e, t, n, r, 1)
        },
        off: function(e, t, n) {
            var r, i;
            if (e && e.preventDefault && e.handleObj)
                return r = e.handleObj,
                he(e.delegateTarget).off(r.namespace ? r.origType + "." + r.namespace : r.origType, r.selector, r.handler),
                this;
            if ("object" == typeof e) {
                for (i in e)
                    this.off(i, t, e[i]);
                return this
            }
            return !1 !== t && "function" != typeof t || (n = t,
            t = void 0),
            !1 === n && (n = T),
            this.each(function() {
                he.event.remove(this, e, n, t)
            })
        }
    });
    var Je = /<script|<style|<link/i
      , Ke = /checked\s*(?:[^=]|=\s*.checked.)/i
      , Ze = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;
    he.extend({
        htmlPrefilter: function(e) {
            return e
        },
        clone: function(e, t, n) {
            var r, i, o, a, s, u, l, c = e.cloneNode(!0), f = We(e);
            if (!(ue.noCloneChecked || 1 !== e.nodeType && 11 !== e.nodeType || he.isXMLDoc(e)))
                for (a = m(c),
                r = 0,
                i = (o = m(e)).length; r < i; r++)
                    s = o[r],
                    u = a[r],
                    "input" === (l = u.nodeName.toLowerCase()) && Ue.test(s.type) ? u.checked = s.checked : "input" !== l && "textarea" !== l || (u.defaultValue = s.defaultValue);
            if (t)
                if (n)
                    for (o = o || m(e),
                    a = a || m(c),
                    r = 0,
                    i = o.length; r < i; r++)
                        j(o[r], a[r]);
                else
                    j(e, c);
            return 0 < (a = m(c, "script")).length && x(a, !f && m(e, "script")),
            c
        },
        cleanData: function(e) {
            for (var t, n, r, i = he.event.special, o = 0; void 0 !== (n = e[o]); o++)
                if (De(n)) {
                    if (t = n[qe.expando]) {
                        if (t.events)
                            for (r in t.events)
                                i[r] ? he.event.remove(n, r) : he.removeEvent(n, r, t.handle);
                        n[qe.expando] = void 0
                    }
                    n[Le.expando] && (n[Le.expando] = void 0)
                }
        }
    }),
    he.fn.extend({
        detach: function(e) {
            return q(this, e, !0)
        },
        remove: function(e) {
            return q(this, e)
        },
        text: function(e) {
            return Ae(this, function(e) {
                return void 0 === e ? he.text(this) : this.empty().each(function() {
                    1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || (this.textContent = e)
                })
            }, null, e, arguments.length)
        },
        append: function() {
            return D(this, arguments, function(e) {
                1 !== this.nodeType && 11 !== this.nodeType && 9 !== this.nodeType || k(this, e).appendChild(e)
            })
        },
        prepend: function() {
            return D(this, arguments, function(e) {
                if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                    var t = k(this, e);
                    t.insertBefore(e, t.firstChild)
                }
            })
        },
        before: function() {
            return D(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this)
            })
        },
        after: function() {
            return D(this, arguments, function(e) {
                this.parentNode && this.parentNode.insertBefore(e, this.nextSibling)
            })
        },
        empty: function() {
            for (var e, t = 0; null != (e = this[t]); t++)
                1 === e.nodeType && (he.cleanData(m(e, !1)),
                e.textContent = "");
            return this
        },
        clone: function(e, t) {
            return e = null != e && e,
            t = null == t ? e : t,
            this.map(function() {
                return he.clone(this, e, t)
            })
        },
        html: function(e) {
            return Ae(this, function(e) {
                var t = this[0] || {}
                  , n = 0
                  , r = this.length;
                if (void 0 === e && 1 === t.nodeType)
                    return t.innerHTML;
                if ("string" == typeof e && !Je.test(e) && !Ge[(Xe.exec(e) || ["", ""])[1].toLowerCase()]) {
                    e = he.htmlPrefilter(e);
                    try {
                        for (; n < r; n++)
                            1 === (t = this[n] || {}).nodeType && (he.cleanData(m(t, !1)),
                            t.innerHTML = e);
                        t = 0
                    } catch (e) {}
                }
                t && this.empty().append(e)
            }, null, e, arguments.length)
        },
        replaceWith: function() {
            var e = [];
            return D(this, arguments, function(t) {
                var n = this.parentNode;
                he.inArray(this, e) < 0 && (he.cleanData(m(this)),
                n && n.replaceChild(t, this))
            }, e)
        }
    }),
    he.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(e, t) {
        he.fn[e] = function(e) {
            for (var n, r = [], i = he(e), o = i.length - 1, a = 0; a <= o; a++)
                n = a === o ? this : this.clone(!0),
                he(i[a])[t](n),
                te.apply(r, n.get());
            return this.pushStack(r)
        }
    });
    var et = new RegExp("^(" + Pe + ")(?!px)[a-z%]+$","i")
      , tt = function(t) {
        var n = t.ownerDocument.defaultView;
        return n && n.opener || (n = e),
        n.getComputedStyle(t)
    }
      , nt = function(e, t, n) {
        var r, i, o = {};
        for (i in t)
            o[i] = e.style[i],
            e.style[i] = t[i];
        for (i in r = n.call(e),
        t)
            e.style[i] = o[i];
        return r
    }
      , rt = new RegExp(Me.join("|"),"i");
    !function() {
        function t() {
            if (c) {
                l.style.cssText = "position:absolute;left:-11111px;width:60px;margin-top:1px;padding:0;border:0",
                c.style.cssText = "position:relative;display:block;box-sizing:border-box;overflow:scroll;margin:auto;border:1px;padding:1px;width:60%;top:1%",
                Ie.appendChild(l).appendChild(c);
                var t = e.getComputedStyle(c);
                r = "1%" !== t.top,
                u = 12 === n(t.marginLeft),
                c.style.right = "60%",
                a = 36 === n(t.right),
                i = 36 === n(t.width),
                c.style.position = "absolute",
                o = 12 === n(c.offsetWidth / 3),
                Ie.removeChild(l),
                c = null
            }
        }
        function n(e) {
            return Math.round(parseFloat(e))
        }
        var r, i, o, a, s, u, l = fe.createElement("div"), c = fe.createElement("div");
        c.style && (c.style.backgroundClip = "content-box",
        c.cloneNode(!0).style.backgroundClip = "",
        ue.clearCloneStyle = "content-box" === c.style.backgroundClip,
        he.extend(ue, {
            boxSizingReliable: function() {
                return t(),
                i
            },
            pixelBoxStyles: function() {
                return t(),
                a
            },
            pixelPosition: function() {
                return t(),
                r
            },
            reliableMarginLeft: function() {
                return t(),
                u
            },
            scrollboxSize: function() {
                return t(),
                o
            },
            reliableTrDimensions: function() {
                var t, n, r, i;
                return null == s && (t = fe.createElement("table"),
                n = fe.createElement("tr"),
                r = fe.createElement("div"),
                t.style.cssText = "position:absolute;left:-11111px;border-collapse:separate",
                n.style.cssText = "border:1px solid",
                n.style.height = "1px",
                r.style.height = "9px",
                r.style.display = "block",
                Ie.appendChild(t).appendChild(n).appendChild(r),
                i = e.getComputedStyle(n),
                s = parseInt(i.height, 10) + parseInt(i.borderTopWidth, 10) + parseInt(i.borderBottomWidth, 10) === n.offsetHeight,
                Ie.removeChild(t)),
                s
            }
        }))
    }();
    var it = ["Webkit", "Moz", "ms"]
      , ot = fe.createElement("div").style
      , at = {}
      , st = /^(none|table(?!-c[ea]).+)/
      , ut = /^--/
      , lt = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }
      , ct = {
        letterSpacing: "0",
        fontWeight: "400"
    };
    he.extend({
        cssHooks: {
            opacity: {
                get: function(e, t) {
                    if (t) {
                        var n = L(e, "opacity");
                        return "" === n ? "1" : n
                    }
                }
            }
        },
        cssNumber: {
            animationIterationCount: !0,
            columnCount: !0,
            fillOpacity: !0,
            flexGrow: !0,
            flexShrink: !0,
            fontWeight: !0,
            gridArea: !0,
            gridColumn: !0,
            gridColumnEnd: !0,
            gridColumnStart: !0,
            gridRow: !0,
            gridRowEnd: !0,
            gridRowStart: !0,
            lineHeight: !0,
            opacity: !0,
            order: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {},
        style: function(e, t, n, r) {
            if (e && 3 !== e.nodeType && 8 !== e.nodeType && e.style) {
                var i, o, a, s = d(t), u = ut.test(t), l = e.style;
                if (u || (t = O(s)),
                a = he.cssHooks[t] || he.cssHooks[s],
                void 0 === n)
                    return a && "get"in a && void 0 !== (i = a.get(e, !1, r)) ? i : l[t];
                "string" == (o = typeof n) && (i = Re.exec(n)) && i[1] && (n = v(e, t, i),
                o = "number"),
                null != n && n == n && ("number" !== o || u || (n += i && i[3] || (he.cssNumber[s] ? "" : "px")),
                ue.clearCloneStyle || "" !== n || 0 !== t.indexOf("background") || (l[t] = "inherit"),
                a && "set"in a && void 0 === (n = a.set(e, n, r)) || (u ? l.setProperty(t, n) : l[t] = n))
            }
        },
        css: function(e, t, n, r) {
            var i, o, a, s = d(t);
            return ut.test(t) || (t = O(s)),
            (a = he.cssHooks[t] || he.cssHooks[s]) && "get"in a && (i = a.get(e, !0, n)),
            void 0 === i && (i = L(e, t, r)),
            "normal" === i && t in ct && (i = ct[t]),
            "" === n || n ? (o = parseFloat(i),
            !0 === n || isFinite(o) ? o || 0 : i) : i
        }
    }),
    he.each(["height", "width"], function(e, t) {
        he.cssHooks[t] = {
            get: function(e, n, r) {
                if (n)
                    return !st.test(he.css(e, "display")) || e.getClientRects().length && e.getBoundingClientRect().width ? M(e, t, r) : nt(e, lt, function() {
                        return M(e, t, r)
                    })
            },
            set: function(e, n, r) {
                var i, o = tt(e), a = !ue.scrollboxSize() && "absolute" === o.position, s = (a || r) && "border-box" === he.css(e, "boxSizing", !1, o), u = r ? R(e, t, r, s, o) : 0;
                return s && a && (u -= Math.ceil(e["offset" + t[0].toUpperCase() + t.slice(1)] - parseFloat(o[t]) - R(e, t, "border", !1, o) - .5)),
                u && (i = Re.exec(n)) && "px" !== (i[3] || "px") && (e.style[t] = n,
                n = he.css(e, t)),
                P(0, n, u)
            }
        }
    }),
    he.cssHooks.marginLeft = H(ue.reliableMarginLeft, function(e, t) {
        if (t)
            return (parseFloat(L(e, "marginLeft")) || e.getBoundingClientRect().left - nt(e, {
                marginLeft: 0
            }, function() {
                return e.getBoundingClientRect().left
            })) + "px"
    }),
    he.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(e, t) {
        he.cssHooks[e + t] = {
            expand: function(n) {
                for (var r = 0, i = {}, o = "string" == typeof n ? n.split(" ") : [n]; r < 4; r++)
                    i[e + Me[r] + t] = o[r] || o[r - 2] || o[0];
                return i
            }
        },
        "margin" !== e && (he.cssHooks[e + t].set = P)
    }),
    he.fn.extend({
        css: function(e, t) {
            return Ae(this, function(e, t, n) {
                var r, i, o = {}, a = 0;
                if (Array.isArray(t)) {
                    for (r = tt(e),
                    i = t.length; a < i; a++)
                        o[t[a]] = he.css(e, t[a], !1, r);
                    return o
                }
                return void 0 !== n ? he.style(e, t, n) : he.css(e, t)
            }, e, t, 1 < arguments.length)
        }
    }),
    ((he.Tween = I).prototype = {
        constructor: I,
        init: function(e, t, n, r, i, o) {
            this.elem = e,
            this.prop = n,
            this.easing = i || he.easing._default,
            this.options = t,
            this.start = this.now = this.cur(),
            this.end = r,
            this.unit = o || (he.cssNumber[n] ? "" : "px")
        },
        cur: function() {
            var e = I.propHooks[this.prop];
            return e && e.get ? e.get(this) : I.propHooks._default.get(this)
        },
        run: function(e) {
            var t, n = I.propHooks[this.prop];
            return this.options.duration ? this.pos = t = he.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e,
            this.now = (this.end - this.start) * t + this.start,
            this.options.step && this.options.step.call(this.elem, this.now, this),
            n && n.set ? n.set(this) : I.propHooks._default.set(this),
            this
        }
    }).init.prototype = I.prototype,
    (I.propHooks = {
        _default: {
            get: function(e) {
                var t;
                return 1 !== e.elem.nodeType || null != e.elem[e.prop] && null == e.elem.style[e.prop] ? e.elem[e.prop] : (t = he.css(e.elem, e.prop, "")) && "auto" !== t ? t : 0
            },
            set: function(e) {
                he.fx.step[e.prop] ? he.fx.step[e.prop](e) : 1 !== e.elem.nodeType || !he.cssHooks[e.prop] && null == e.elem.style[O(e.prop)] ? e.elem[e.prop] = e.now : he.style(e.elem, e.prop, e.now + e.unit)
            }
        }
    }).scrollTop = I.propHooks.scrollLeft = {
        set: function(e) {
            e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
        }
    },
    he.easing = {
        linear: function(e) {
            return e
        },
        swing: function(e) {
            return .5 - Math.cos(e * Math.PI) / 2
        },
        _default: "swing"
    },
    he.fx = I.prototype.init,
    he.fx.step = {};
    var ft, pt, dt, ht, gt = /^(?:toggle|show|hide)$/, vt = /queueHooks$/;
    he.Animation = he.extend(_, {
        tweeners: {
            "*": [function(e, t) {
                var n = this.createTween(e, t);
                return v(n.elem, e, Re.exec(t), n),
                n
            }
            ]
        },
        tweener: function(e, t) {
            le(e) ? (t = e,
            e = ["*"]) : e = e.match(Ee);
            for (var n, r = 0, i = e.length; r < i; r++)
                n = e[r],
                _.tweeners[n] = _.tweeners[n] || [],
                _.tweeners[n].unshift(t)
        },
        prefilters: [function(e, t, n) {
            var r, i, o, a, s, u, l, c, f = "width"in t || "height"in t, p = this, d = {}, h = e.style, g = e.nodeType && Be(e), v = qe.get(e, "fxshow");
            for (r in n.queue || (null == (a = he._queueHooks(e, "fx")).unqueued && (a.unqueued = 0,
            s = a.empty.fire,
            a.empty.fire = function() {
                a.unqueued || s()
            }
            ),
            a.unqueued++,
            p.always(function() {
                p.always(function() {
                    a.unqueued--,
                    he.queue(e, "fx").length || a.empty.fire()
                })
            })),
            t)
                if (i = t[r],
                gt.test(i)) {
                    if (delete t[r],
                    o = o || "toggle" === i,
                    i === (g ? "hide" : "show")) {
                        if ("show" !== i || !v || void 0 === v[r])
                            continue;
                        g = !0
                    }
                    d[r] = v && v[r] || he.style(e, r)
                }
            if ((u = !he.isEmptyObject(t)) || !he.isEmptyObject(d))
                for (r in f && 1 === e.nodeType && (n.overflow = [h.overflow, h.overflowX, h.overflowY],
                null == (l = v && v.display) && (l = qe.get(e, "display")),
                "none" === (c = he.css(e, "display")) && (l ? c = l : (y([e], !0),
                l = e.style.display || l,
                c = he.css(e, "display"),
                y([e]))),
                ("inline" === c || "inline-block" === c && null != l) && "none" === he.css(e, "float") && (u || (p.done(function() {
                    h.display = l
                }),
                null == l && (c = h.display,
                l = "none" === c ? "" : c)),
                h.display = "inline-block")),
                n.overflow && (h.overflow = "hidden",
                p.always(function() {
                    h.overflow = n.overflow[0],
                    h.overflowX = n.overflow[1],
                    h.overflowY = n.overflow[2]
                })),
                u = !1,
                d)
                    u || (v ? "hidden"in v && (g = v.hidden) : v = qe.access(e, "fxshow", {
                        display: l
                    }),
                    o && (v.hidden = !g),
                    g && y([e], !0),
                    p.done(function() {
                        for (r in g || y([e]),
                        qe.remove(e, "fxshow"),
                        d)
                            he.style(e, r, d[r])
                    })),
                    u = $(g ? v[r] : 0, r, p),
                    r in v || (v[r] = u.start,
                    g && (u.end = u.start,
                    u.start = 0))
        }
        ],
        prefilter: function(e, t) {
            t ? _.prefilters.unshift(e) : _.prefilters.push(e)
        }
    }),
    he.speed = function(e, t, n) {
        var r = e && "object" == typeof e ? he.extend({}, e) : {
            complete: n || !n && t || le(e) && e,
            duration: e,
            easing: n && t || t && !le(t) && t
        };
        return he.fx.off ? r.duration = 0 : "number" != typeof r.duration && (r.duration in he.fx.speeds ? r.duration = he.fx.speeds[r.duration] : r.duration = he.fx.speeds._default),
        null != r.queue && !0 !== r.queue || (r.queue = "fx"),
        r.old = r.complete,
        r.complete = function() {
            le(r.old) && r.old.call(this),
            r.queue && he.dequeue(this, r.queue)
        }
        ,
        r
    }
    ,
    he.fn.extend({
        fadeTo: function(e, t, n, r) {
            return this.filter(Be).css("opacity", 0).show().end().animate({
                opacity: t
            }, e, n, r)
        },
        animate: function(e, t, n, r) {
            var i = he.isEmptyObject(e)
              , o = he.speed(t, n, r)
              , a = function() {
                var t = _(this, he.extend({}, e), o);
                (i || qe.get(this, "finish")) && t.stop(!0)
            };
            return a.finish = a,
            i || !1 === o.queue ? this.each(a) : this.queue(o.queue, a)
        },
        stop: function(e, t, n) {
            var r = function(e) {
                var t = e.stop;
                delete e.stop,
                t(n)
            };
            return "string" != typeof e && (n = t,
            t = e,
            e = void 0),
            t && this.queue(e || "fx", []),
            this.each(function() {
                var t = !0
                  , i = null != e && e + "queueHooks"
                  , o = he.timers
                  , a = qe.get(this);
                if (i)
                    a[i] && a[i].stop && r(a[i]);
                else
                    for (i in a)
                        a[i] && a[i].stop && vt.test(i) && r(a[i]);
                for (i = o.length; i--; )
                    o[i].elem !== this || null != e && o[i].queue !== e || (o[i].anim.stop(n),
                    t = !1,
                    o.splice(i, 1));
                !t && n || he.dequeue(this, e)
            })
        },
        finish: function(e) {
            return !1 !== e && (e = e || "fx"),
            this.each(function() {
                var t, n = qe.get(this), r = n[e + "queue"], i = n[e + "queueHooks"], o = he.timers, a = r ? r.length : 0;
                for (n.finish = !0,
                he.queue(this, e, []),
                i && i.stop && i.stop.call(this, !0),
                t = o.length; t--; )
                    o[t].elem === this && o[t].queue === e && (o[t].anim.stop(!0),
                    o.splice(t, 1));
                for (t = 0; t < a; t++)
                    r[t] && r[t].finish && r[t].finish.call(this);
                delete n.finish
            })
        }
    }),
    he.each(["toggle", "show", "hide"], function(e, t) {
        var n = he.fn[t];
        he.fn[t] = function(e, r, i) {
            return null == e || "boolean" == typeof e ? n.apply(this, arguments) : this.animate(B(t, !0), e, r, i)
        }
    }),
    he.each({
        slideDown: B("show"),
        slideUp: B("hide"),
        slideToggle: B("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(e, t) {
        he.fn[e] = function(e, n, r) {
            return this.animate(t, e, n, r)
        }
    }),
    he.timers = [],
    he.fx.tick = function() {
        var e, t = 0, n = he.timers;
        for (ft = Date.now(); t < n.length; t++)
            (e = n[t])() || n[t] !== e || n.splice(t--, 1);
        n.length || he.fx.stop(),
        ft = void 0
    }
    ,
    he.fx.timer = function(e) {
        he.timers.push(e),
        he.fx.start()
    }
    ,
    he.fx.interval = 13,
    he.fx.start = function() {
        pt || (pt = !0,
        W())
    }
    ,
    he.fx.stop = function() {
        pt = null
    }
    ,
    he.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    },
    he.fn.delay = function(t, n) {
        return t = he.fx && he.fx.speeds[t] || t,
        n = n || "fx",
        this.queue(n, function(n, r) {
            var i = e.setTimeout(n, t);
            r.stop = function() {
                e.clearTimeout(i)
            }
        })
    }
    ,
    dt = fe.createElement("input"),
    ht = fe.createElement("select").appendChild(fe.createElement("option")),
    dt.type = "checkbox",
    ue.checkOn = "" !== dt.value,
    ue.optSelected = ht.selected,
    (dt = fe.createElement("input")).value = "t",
    dt.type = "radio",
    ue.radioValue = "t" === dt.value;
    var yt, mt = he.expr.attrHandle;
    he.fn.extend({
        attr: function(e, t) {
            return Ae(this, he.attr, e, t, 1 < arguments.length)
        },
        removeAttr: function(e) {
            return this.each(function() {
                he.removeAttr(this, e)
            })
        }
    }),
    he.extend({
        attr: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return void 0 === e.getAttribute ? he.prop(e, t, n) : (1 === o && he.isXMLDoc(e) || (i = he.attrHooks[t.toLowerCase()] || (he.expr.match.bool.test(t) ? yt : void 0)),
                void 0 !== n ? null === n ? void he.removeAttr(e, t) : i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : (e.setAttribute(t, n + ""),
                n) : i && "get"in i && null !== (r = i.get(e, t)) ? r : null == (r = he.find.attr(e, t)) ? void 0 : r)
        },
        attrHooks: {
            type: {
                set: function(e, t) {
                    if (!ue.radioValue && "radio" === t && o(e, "input")) {
                        var n = e.value;
                        return e.setAttribute("type", t),
                        n && (e.value = n),
                        t
                    }
                }
            }
        },
        removeAttr: function(e, t) {
            var n, r = 0, i = t && t.match(Ee);
            if (i && 1 === e.nodeType)
                for (; n = i[r++]; )
                    e.removeAttribute(n)
        }
    }),
    yt = {
        set: function(e, t, n) {
            return !1 === t ? he.removeAttr(e, n) : e.setAttribute(n, n),
            n
        }
    },
    he.each(he.expr.match.bool.source.match(/\w+/g), function(e, t) {
        var n = mt[t] || he.find.attr;
        mt[t] = function(e, t, r) {
            var i, o, a = t.toLowerCase();
            return r || (o = mt[a],
            mt[a] = i,
            i = null != n(e, t, r) ? a : null,
            mt[a] = o),
            i
        }
    });
    var xt = /^(?:input|select|textarea|button)$/i
      , bt = /^(?:a|area)$/i;
    he.fn.extend({
        prop: function(e, t) {
            return Ae(this, he.prop, e, t, 1 < arguments.length)
        },
        removeProp: function(e) {
            return this.each(function() {
                delete this[he.propFix[e] || e]
            })
        }
    }),
    he.extend({
        prop: function(e, t, n) {
            var r, i, o = e.nodeType;
            if (3 !== o && 8 !== o && 2 !== o)
                return 1 === o && he.isXMLDoc(e) || (t = he.propFix[t] || t,
                i = he.propHooks[t]),
                void 0 !== n ? i && "set"in i && void 0 !== (r = i.set(e, n, t)) ? r : e[t] = n : i && "get"in i && null !== (r = i.get(e, t)) ? r : e[t]
        },
        propHooks: {
            tabIndex: {
                get: function(e) {
                    var t = he.find.attr(e, "tabindex");
                    return t ? parseInt(t, 10) : xt.test(e.nodeName) || bt.test(e.nodeName) && e.href ? 0 : -1
                }
            }
        },
        propFix: {
            for: "htmlFor",
            class: "className"
        }
    }),
    ue.optSelected || (he.propHooks.selected = {
        get: function(e) {
            var t = e.parentNode;
            return t && t.parentNode && t.parentNode.selectedIndex,
            null
        },
        set: function(e) {
            var t = e.parentNode;
            t && (t.selectedIndex,
            t.parentNode && t.parentNode.selectedIndex)
        }
    }),
    he.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
        he.propFix[this.toLowerCase()] = this
    }),
    he.fn.extend({
        addClass: function(e) {
            var t, n, r, i, o, a, s, u = 0;
            if (le(e))
                return this.each(function(t) {
                    he(this).addClass(e.call(this, t, U(this)))
                });
            if ((t = X(e)).length)
                for (; n = this[u++]; )
                    if (i = U(n),
                    r = 1 === n.nodeType && " " + z(i) + " ") {
                        for (a = 0; o = t[a++]; )
                            r.indexOf(" " + o + " ") < 0 && (r += o + " ");
                        i !== (s = z(r)) && n.setAttribute("class", s)
                    }
            return this
        },
        removeClass: function(e) {
            var t, n, r, i, o, a, s, u = 0;
            if (le(e))
                return this.each(function(t) {
                    he(this).removeClass(e.call(this, t, U(this)))
                });
            if (!arguments.length)
                return this.attr("class", "");
            if ((t = X(e)).length)
                for (; n = this[u++]; )
                    if (i = U(n),
                    r = 1 === n.nodeType && " " + z(i) + " ") {
                        for (a = 0; o = t[a++]; )
                            for (; -1 < r.indexOf(" " + o + " "); )
                                r = r.replace(" " + o + " ", " ");
                        i !== (s = z(r)) && n.setAttribute("class", s)
                    }
            return this
        },
        toggleClass: function(e, t) {
            var n = typeof e
              , r = "string" === n || Array.isArray(e);
            return "boolean" == typeof t && r ? t ? this.addClass(e) : this.removeClass(e) : le(e) ? this.each(function(n) {
                he(this).toggleClass(e.call(this, n, U(this), t), t)
            }) : this.each(function() {
                var t, i, o, a;
                if (r)
                    for (i = 0,
                    o = he(this),
                    a = X(e); t = a[i++]; )
                        o.hasClass(t) ? o.removeClass(t) : o.addClass(t);
                else
                    void 0 !== e && "boolean" !== n || ((t = U(this)) && qe.set(this, "__className__", t),
                    this.setAttribute && this.setAttribute("class", t || !1 === e ? "" : qe.get(this, "__className__") || ""))
            })
        },
        hasClass: function(e) {
            var t, n, r = 0;
            for (t = " " + e + " "; n = this[r++]; )
                if (1 === n.nodeType && -1 < (" " + z(U(n)) + " ").indexOf(t))
                    return !0;
            return !1
        }
    });
    var wt = /\r/g;
    he.fn.extend({
        val: function(e) {
            var t, n, r, i = this[0];
            return arguments.length ? (r = le(e),
            this.each(function(n) {
                var i;
                1 === this.nodeType && (null == (i = r ? e.call(this, n, he(this).val()) : e) ? i = "" : "number" == typeof i ? i += "" : Array.isArray(i) && (i = he.map(i, function(e) {
                    return null == e ? "" : e + ""
                })),
                (t = he.valHooks[this.type] || he.valHooks[this.nodeName.toLowerCase()]) && "set"in t && void 0 !== t.set(this, i, "value") || (this.value = i))
            })) : i ? (t = he.valHooks[i.type] || he.valHooks[i.nodeName.toLowerCase()]) && "get"in t && void 0 !== (n = t.get(i, "value")) ? n : "string" == typeof (n = i.value) ? n.replace(wt, "") : null == n ? "" : n : void 0
        }
    }),
    he.extend({
        valHooks: {
            option: {
                get: function(e) {
                    var t = he.find.attr(e, "value");
                    return null != t ? t : z(he.text(e))
                }
            },
            select: {
                get: function(e) {
                    var t, n, r, i = e.options, a = e.selectedIndex, s = "select-one" === e.type, u = s ? null : [], l = s ? a + 1 : i.length;
                    for (r = a < 0 ? l : s ? a : 0; r < l; r++)
                        if (((n = i[r]).selected || r === a) && !n.disabled && (!n.parentNode.disabled || !o(n.parentNode, "optgroup"))) {
                            if (t = he(n).val(),
                            s)
                                return t;
                            u.push(t)
                        }
                    return u
                },
                set: function(e, t) {
                    for (var n, r, i = e.options, o = he.makeArray(t), a = i.length; a--; )
                        ((r = i[a]).selected = -1 < he.inArray(he.valHooks.option.get(r), o)) && (n = !0);
                    return n || (e.selectedIndex = -1),
                    o
                }
            }
        }
    }),
    he.each(["radio", "checkbox"], function() {
        he.valHooks[this] = {
            set: function(e, t) {
                if (Array.isArray(t))
                    return e.checked = -1 < he.inArray(he(e).val(), t)
            }
        },
        ue.checkOn || (he.valHooks[this].get = function(e) {
            return null === e.getAttribute("value") ? "on" : e.value
        }
        )
    }),
    ue.focusin = "onfocusin"in e;
    var Tt = /^(?:focusinfocus|focusoutblur)$/
      , Ct = function(e) {
        e.stopPropagation()
    };
    he.extend(he.event, {
        trigger: function(t, n, r, i) {
            var o, a, s, u, l, c, f, p, d = [r || fe], h = oe.call(t, "type") ? t.type : t, g = oe.call(t, "namespace") ? t.namespace.split(".") : [];
            if (a = p = s = r = r || fe,
            3 !== r.nodeType && 8 !== r.nodeType && !Tt.test(h + he.event.triggered) && (-1 < h.indexOf(".") && (h = (g = h.split(".")).shift(),
            g.sort()),
            l = h.indexOf(":") < 0 && "on" + h,
            (t = t[he.expando] ? t : new he.Event(h,"object" == typeof t && t)).isTrigger = i ? 2 : 3,
            t.namespace = g.join("."),
            t.rnamespace = t.namespace ? new RegExp("(^|\\.)" + g.join("\\.(?:.*\\.|)") + "(\\.|$)") : null,
            t.result = void 0,
            t.target || (t.target = r),
            n = null == n ? [t] : he.makeArray(n, [t]),
            f = he.event.special[h] || {},
            i || !f.trigger || !1 !== f.trigger.apply(r, n))) {
                if (!i && !f.noBubble && !ce(r)) {
                    for (u = f.delegateType || h,
                    Tt.test(u + h) || (a = a.parentNode); a; a = a.parentNode)
                        d.push(a),
                        s = a;
                    s === (r.ownerDocument || fe) && d.push(s.defaultView || s.parentWindow || e)
                }
                for (o = 0; (a = d[o++]) && !t.isPropagationStopped(); )
                    p = a,
                    t.type = 1 < o ? u : f.bindType || h,
                    (c = (qe.get(a, "events") || Object.create(null))[t.type] && qe.get(a, "handle")) && c.apply(a, n),
                    (c = l && a[l]) && c.apply && De(a) && (t.result = c.apply(a, n),
                    !1 === t.result && t.preventDefault());
                return t.type = h,
                i || t.isDefaultPrevented() || f._default && !1 !== f._default.apply(d.pop(), n) || !De(r) || l && le(r[h]) && !ce(r) && ((s = r[l]) && (r[l] = null),
                he.event.triggered = h,
                t.isPropagationStopped() && p.addEventListener(h, Ct),
                r[h](),
                t.isPropagationStopped() && p.removeEventListener(h, Ct),
                he.event.triggered = void 0,
                s && (r[l] = s)),
                t.result
            }
        },
        simulate: function(e, t, n) {
            var r = he.extend(new he.Event, n, {
                type: e,
                isSimulated: !0
            });
            he.event.trigger(r, null, t)
        }
    }),
    he.fn.extend({
        trigger: function(e, t) {
            return this.each(function() {
                he.event.trigger(e, t, this)
            })
        },
        triggerHandler: function(e, t) {
            var n = this[0];
            if (n)
                return he.event.trigger(e, t, n, !0)
        }
    }),
    ue.focusin || he.each({
        focus: "focusin",
        blur: "focusout"
    }, function(e, t) {
        var n = function(e) {
            he.event.simulate(t, e.target, he.event.fix(e))
        };
        he.event.special[t] = {
            setup: function() {
                var r = this.ownerDocument || this.document || this
                  , i = qe.access(r, t);
                i || r.addEventListener(e, n, !0),
                qe.access(r, t, (i || 0) + 1)
            },
            teardown: function() {
                var r = this.ownerDocument || this.document || this
                  , i = qe.access(r, t) - 1;
                i ? qe.access(r, t, i) : (r.removeEventListener(e, n, !0),
                qe.remove(r, t))
            }
        }
    });
    var Et = e.location
      , St = {
        guid: Date.now()
    }
      , kt = /\?/;
    he.parseXML = function(t) {
        var n, r;
        if (!t || "string" != typeof t)
            return null;
        try {
            n = (new e.DOMParser).parseFromString(t, "text/xml")
        } catch (t) {}
        return r = n && n.getElementsByTagName("parsererror")[0],
        n && !r || he.error("Invalid XML: " + (r ? he.map(r.childNodes, function(e) {
            return e.textContent
        }).join("\n") : t)),
        n
    }
    ;
    var At = /\[\]$/
      , Nt = /\r?\n/g
      , jt = /^(?:submit|button|image|reset|file)$/i
      , Dt = /^(?:input|select|textarea|keygen)/i;
    he.param = function(e, t) {
        var n, r = [], i = function(e, t) {
            var n = le(t) ? t() : t;
            r[r.length] = encodeURIComponent(e) + "=" + encodeURIComponent(null == n ? "" : n)
        };
        if (null == e)
            return "";
        if (Array.isArray(e) || e.jquery && !he.isPlainObject(e))
            he.each(e, function() {
                i(this.name, this.value)
            });
        else
            for (n in e)
                V(n, e[n], t, i);
        return r.join("&")
    }
    ,
    he.fn.extend({
        serialize: function() {
            return he.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                var e = he.prop(this, "elements");
                return e ? he.makeArray(e) : this
            }).filter(function() {
                var e = this.type;
                return this.name && !he(this).is(":disabled") && Dt.test(this.nodeName) && !jt.test(e) && (this.checked || !Ue.test(e))
            }).map(function(e, t) {
                var n = he(this).val();
                return null == n ? null : Array.isArray(n) ? he.map(n, function(e) {
                    return {
                        name: t.name,
                        value: e.replace(Nt, "\r\n")
                    }
                }) : {
                    name: t.name,
                    value: n.replace(Nt, "\r\n")
                }
            }).get()
        }
    });
    var qt = /%20/g
      , Lt = /#.*$/
      , Ht = /([?&])_=[^&]*/
      , Ot = /^(.*?):[ \t]*([^\r\n]*)$/gm
      , Pt = /^(?:GET|HEAD)$/
      , Rt = /^\/\//
      , Mt = {}
      , It = {}
      , Wt = "*/".concat("*")
      , Ft = fe.createElement("a");
    Ft.href = Et.href,
    he.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: Et.href,
            type: "GET",
            isLocal: /^(?:about|app|app-storage|.+-extension|file|res|widget):$/.test(Et.protocol),
            global: !0,
            processData: !0,
            async: !0,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": Wt,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /\bxml\b/,
                html: /\bhtml/,
                json: /\bjson\b/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": !0,
                "text json": JSON.parse,
                "text xml": he.parseXML
            },
            flatOptions: {
                url: !0,
                context: !0
            }
        },
        ajaxSetup: function(e, t) {
            return t ? Q(Q(e, he.ajaxSettings), t) : Q(he.ajaxSettings, e)
        },
        ajaxPrefilter: G(Mt),
        ajaxTransport: G(It),
        ajax: function(t, n) {
            function r(t, n, r, s) {
                var l, p, d, b, w, T = n;
                c || (c = !0,
                u && e.clearTimeout(u),
                i = void 0,
                a = s || "",
                C.readyState = 0 < t ? 4 : 0,
                l = 200 <= t && t < 300 || 304 === t,
                r && (b = function(e, t, n) {
                    for (var r, i, o, a, s = e.contents, u = e.dataTypes; "*" === u[0]; )
                        u.shift(),
                        void 0 === r && (r = e.mimeType || t.getResponseHeader("Content-Type"));
                    if (r)
                        for (i in s)
                            if (s[i] && s[i].test(r)) {
                                u.unshift(i);
                                break
                            }
                    if (u[0]in n)
                        o = u[0];
                    else {
                        for (i in n) {
                            if (!u[0] || e.converters[i + " " + u[0]]) {
                                o = i;
                                break
                            }
                            a || (a = i)
                        }
                        o = o || a
                    }
                    if (o)
                        return o !== u[0] && u.unshift(o),
                        n[o]
                }(h, C, r)),
                !l && -1 < he.inArray("script", h.dataTypes) && he.inArray("json", h.dataTypes) < 0 && (h.converters["text script"] = function() {}
                ),
                b = function(e, t, n, r) {
                    var i, o, a, s, u, l = {}, c = e.dataTypes.slice();
                    if (c[1])
                        for (a in e.converters)
                            l[a.toLowerCase()] = e.converters[a];
                    for (o = c.shift(); o; )
                        if (e.responseFields[o] && (n[e.responseFields[o]] = t),
                        !u && r && e.dataFilter && (t = e.dataFilter(t, e.dataType)),
                        u = o,
                        o = c.shift())
                            if ("*" === o)
                                o = u;
                            else if ("*" !== u && u !== o) {
                                if (!(a = l[u + " " + o] || l["* " + o]))
                                    for (i in l)
                                        if ((s = i.split(" "))[1] === o && (a = l[u + " " + s[0]] || l["* " + s[0]])) {
                                            !0 === a ? a = l[i] : !0 !== l[i] && (o = s[0],
                                            c.unshift(s[1]));
                                            break
                                        }
                                if (!0 !== a)
                                    if (a && e.throws)
                                        t = a(t);
                                    else
                                        try {
                                            t = a(t)
                                        } catch (e) {
                                            return {
                                                state: "parsererror",
                                                error: a ? e : "No conversion from " + u + " to " + o
                                            }
                                        }
                            }
                    return {
                        state: "success",
                        data: t
                    }
                }(h, b, C, l),
                l ? (h.ifModified && ((w = C.getResponseHeader("Last-Modified")) && (he.lastModified[o] = w),
                (w = C.getResponseHeader("etag")) && (he.etag[o] = w)),
                204 === t || "HEAD" === h.type ? T = "nocontent" : 304 === t ? T = "notmodified" : (T = b.state,
                p = b.data,
                l = !(d = b.error))) : (d = T,
                !t && T || (T = "error",
                t < 0 && (t = 0))),
                C.status = t,
                C.statusText = (n || T) + "",
                l ? y.resolveWith(g, [p, T, C]) : y.rejectWith(g, [C, T, d]),
                C.statusCode(x),
                x = void 0,
                f && v.trigger(l ? "ajaxSuccess" : "ajaxError", [C, h, l ? p : d]),
                m.fireWith(g, [C, T]),
                f && (v.trigger("ajaxComplete", [C, h]),
                --he.active || he.event.trigger("ajaxStop")))
            }
            "object" == typeof t && (n = t,
            t = void 0),
            n = n || {};
            var i, o, a, s, u, l, c, f, p, d, h = he.ajaxSetup({}, n), g = h.context || h, v = h.context && (g.nodeType || g.jquery) ? he(g) : he.event, y = he.Deferred(), m = he.Callbacks("once memory"), x = h.statusCode || {}, b = {}, w = {}, T = "canceled", C = {
                readyState: 0,
                getResponseHeader: function(e) {
                    var t;
                    if (c) {
                        if (!s)
                            for (s = {}; t = Ot.exec(a); )
                                s[t[1].toLowerCase() + " "] = (s[t[1].toLowerCase() + " "] || []).concat(t[2]);
                        t = s[e.toLowerCase() + " "]
                    }
                    return null == t ? null : t.join(", ")
                },
                getAllResponseHeaders: function() {
                    return c ? a : null
                },
                setRequestHeader: function(e, t) {
                    return null == c && (e = w[e.toLowerCase()] = w[e.toLowerCase()] || e,
                    b[e] = t),
                    this
                },
                overrideMimeType: function(e) {
                    return null == c && (h.mimeType = e),
                    this
                },
                statusCode: function(e) {
                    var t;
                    if (e)
                        if (c)
                            C.always(e[C.status]);
                        else
                            for (t in e)
                                x[t] = [x[t], e[t]];
                    return this
                },
                abort: function(e) {
                    var t = e || T;
                    return i && i.abort(t),
                    r(0, t),
                    this
                }
            };
            if (y.promise(C),
            h.url = ((t || h.url || Et.href) + "").replace(Rt, Et.protocol + "//"),
            h.type = n.method || n.type || h.method || h.type,
            h.dataTypes = (h.dataType || "*").toLowerCase().match(Ee) || [""],
            null == h.crossDomain) {
                l = fe.createElement("a");
                try {
                    l.href = h.url,
                    l.href = l.href,
                    h.crossDomain = Ft.protocol + "//" + Ft.host != l.protocol + "//" + l.host
                } catch (t) {
                    h.crossDomain = !0
                }
            }
            if (h.data && h.processData && "string" != typeof h.data && (h.data = he.param(h.data, h.traditional)),
            Y(Mt, h, n, C),
            c)
                return C;
            for (p in (f = he.event && h.global) && 0 == he.active++ && he.event.trigger("ajaxStart"),
            h.type = h.type.toUpperCase(),
            h.hasContent = !Pt.test(h.type),
            o = h.url.replace(Lt, ""),
            h.hasContent ? h.data && h.processData && 0 === (h.contentType || "").indexOf("application/x-www-form-urlencoded") && (h.data = h.data.replace(qt, "+")) : (d = h.url.slice(o.length),
            h.data && (h.processData || "string" == typeof h.data) && (o += (kt.test(o) ? "&" : "?") + h.data,
            delete h.data),
            !1 === h.cache && (o = o.replace(Ht, "$1"),
            d = (kt.test(o) ? "&" : "?") + "_=" + St.guid++ + d),
            h.url = o + d),
            h.ifModified && (he.lastModified[o] && C.setRequestHeader("If-Modified-Since", he.lastModified[o]),
            he.etag[o] && C.setRequestHeader("If-None-Match", he.etag[o])),
            (h.data && h.hasContent && !1 !== h.contentType || n.contentType) && C.setRequestHeader("Content-Type", h.contentType),
            C.setRequestHeader("Accept", h.dataTypes[0] && h.accepts[h.dataTypes[0]] ? h.accepts[h.dataTypes[0]] + ("*" !== h.dataTypes[0] ? ", " + Wt + "; q=0.01" : "") : h.accepts["*"]),
            h.headers)
                C.setRequestHeader(p, h.headers[p]);
            if (h.beforeSend && (!1 === h.beforeSend.call(g, C, h) || c))
                return C.abort();
            if (T = "abort",
            m.add(h.complete),
            C.done(h.success),
            C.fail(h.error),
            i = Y(It, h, n, C)) {
                if (C.readyState = 1,
                f && v.trigger("ajaxSend", [C, h]),
                c)
                    return C;
                h.async && 0 < h.timeout && (u = e.setTimeout(function() {
                    C.abort("timeout")
                }, h.timeout));
                try {
                    c = !1,
                    i.send(b, r)
                } catch (t) {
                    if (c)
                        throw t;
                    r(-1, t)
                }
            } else
                r(-1, "No Transport");
            return C
        },
        getJSON: function(e, t, n) {
            return he.get(e, t, n, "json")
        },
        getScript: function(e, t) {
            return he.get(e, void 0, t, "script")
        }
    }),
    he.each(["get", "post"], function(e, t) {
        he[t] = function(e, n, r, i) {
            return le(n) && (i = i || r,
            r = n,
            n = void 0),
            he.ajax(he.extend({
                url: e,
                type: t,
                dataType: i,
                data: n,
                success: r
            }, he.isPlainObject(e) && e))
        }
    }),
    he.ajaxPrefilter(function(e) {
        var t;
        for (t in e.headers)
            "content-type" === t.toLowerCase() && (e.contentType = e.headers[t] || "")
    }),
    he._evalUrl = function(e, t, n) {
        return he.ajax({
            url: e,
            type: "GET",
            dataType: "script",
            cache: !0,
            async: !1,
            global: !1,
            converters: {
                "text script": function() {}
            },
            dataFilter: function(e) {
                he.globalEval(e, t, n)
            }
        })
    }
    ,
    he.fn.extend({
        wrapAll: function(e) {
            var t;
            return this[0] && (le(e) && (e = e.call(this[0])),
            t = he(e, this[0].ownerDocument).eq(0).clone(!0),
            this[0].parentNode && t.insertBefore(this[0]),
            t.map(function() {
                for (var e = this; e.firstElementChild; )
                    e = e.firstElementChild;
                return e
            }).append(this)),
            this
        },
        wrapInner: function(e) {
            return le(e) ? this.each(function(t) {
                he(this).wrapInner(e.call(this, t))
            }) : this.each(function() {
                var t = he(this)
                  , n = t.contents();
                n.length ? n.wrapAll(e) : t.append(e)
            })
        },
        wrap: function(e) {
            var t = le(e);
            return this.each(function(n) {
                he(this).wrapAll(t ? e.call(this, n) : e)
            })
        },
        unwrap: function(e) {
            return this.parent(e).not("body").each(function() {
                he(this).replaceWith(this.childNodes)
            }),
            this
        }
    }),
    he.expr.pseudos.hidden = function(e) {
        return !he.expr.pseudos.visible(e)
    }
    ,
    he.expr.pseudos.visible = function(e) {
        return !!(e.offsetWidth || e.offsetHeight || e.getClientRects().length)
    }
    ,
    he.ajaxSettings.xhr = function() {
        try {
            return new e.XMLHttpRequest
        } catch (e) {}
    }
    ;
    var Bt = {
        0: 200,
        1223: 204
    }
      , $t = he.ajaxSettings.xhr();
    ue.cors = !!$t && "withCredentials"in $t,
    ue.ajax = $t = !!$t,
    he.ajaxTransport(function(t) {
        var n, r;
        if (ue.cors || $t && !t.crossDomain)
            return {
                send: function(i, o) {
                    var a, s = t.xhr();
                    if (s.open(t.type, t.url, t.async, t.username, t.password),
                    t.xhrFields)
                        for (a in t.xhrFields)
                            s[a] = t.xhrFields[a];
                    for (a in t.mimeType && s.overrideMimeType && s.overrideMimeType(t.mimeType),
                    t.crossDomain || i["X-Requested-With"] || (i["X-Requested-With"] = "XMLHttpRequest"),
                    i)
                        s.setRequestHeader(a, i[a]);
                    n = function(e) {
                        return function() {
                            n && (n = r = s.onload = s.onerror = s.onabort = s.ontimeout = s.onreadystatechange = null,
                            "abort" === e ? s.abort() : "error" === e ? "number" != typeof s.status ? o(0, "error") : o(s.status, s.statusText) : o(Bt[s.status] || s.status, s.statusText, "text" !== (s.responseType || "text") || "string" != typeof s.responseText ? {
                                binary: s.response
                            } : {
                                text: s.responseText
                            }, s.getAllResponseHeaders()))
                        }
                    }
                    ,
                    s.onload = n(),
                    r = s.onerror = s.ontimeout = n("error"),
                    void 0 !== s.onabort ? s.onabort = r : s.onreadystatechange = function() {
                        4 === s.readyState && e.setTimeout(function() {
                            n && r()
                        })
                    }
                    ,
                    n = n("abort");
                    try {
                        s.send(t.hasContent && t.data || null)
                    } catch (i) {
                        if (n)
                            throw i
                    }
                },
                abort: function() {
                    n && n()
                }
            }
    }),
    he.ajaxPrefilter(function(e) {
        e.crossDomain && (e.contents.script = !1)
    }),
    he.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /\b(?:java|ecma)script\b/
        },
        converters: {
            "text script": function(e) {
                return he.globalEval(e),
                e
            }
        }
    }),
    he.ajaxPrefilter("script", function(e) {
        void 0 === e.cache && (e.cache = !1),
        e.crossDomain && (e.type = "GET")
    }),
    he.ajaxTransport("script", function(e) {
        var t, n;
        if (e.crossDomain || e.scriptAttrs)
            return {
                send: function(r, i) {
                    t = he("<script>").attr(e.scriptAttrs || {}).prop({
                        charset: e.scriptCharset,
                        src: e.url
                    }).on("load error", n = function(e) {
                        t.remove(),
                        n = null,
                        e && i("error" === e.type ? 404 : 200, e.type)
                    }
                    ),
                    fe.head.appendChild(t[0])
                },
                abort: function() {
                    n && n()
                }
            }
    });
    var _t, zt = [], Ut = /(=)\?(?=&|$)|\?\?/;
    he.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var e = zt.pop() || he.expando + "_" + St.guid++;
            return this[e] = !0,
            e
        }
    }),
    he.ajaxPrefilter("json jsonp", function(t, n, r) {
        var i, o, a, s = !1 !== t.jsonp && (Ut.test(t.url) ? "url" : "string" == typeof t.data && 0 === (t.contentType || "").indexOf("application/x-www-form-urlencoded") && Ut.test(t.data) && "data");
        if (s || "jsonp" === t.dataTypes[0])
            return i = t.jsonpCallback = le(t.jsonpCallback) ? t.jsonpCallback() : t.jsonpCallback,
            s ? t[s] = t[s].replace(Ut, "$1" + i) : !1 !== t.jsonp && (t.url += (kt.test(t.url) ? "&" : "?") + t.jsonp + "=" + i),
            t.converters["script json"] = function() {
                return a || he.error(i + " was not called"),
                a[0]
            }
            ,
            t.dataTypes[0] = "json",
            o = e[i],
            e[i] = function() {
                a = arguments
            }
            ,
            r.always(function() {
                void 0 === o ? he(e).removeProp(i) : e[i] = o,
                t[i] && (t.jsonpCallback = n.jsonpCallback,
                zt.push(i)),
                a && le(o) && o(a[0]),
                a = o = void 0
            }),
            "script"
    }),
    ue.createHTMLDocument = ((_t = fe.implementation.createHTMLDocument("").body).innerHTML = "<form></form><form></form>",
    2 === _t.childNodes.length),
    he.parseHTML = function(e, t, n) {
        return "string" != typeof e ? [] : ("boolean" == typeof t && (n = t,
        t = !1),
        t || (ue.createHTMLDocument ? ((r = (t = fe.implementation.createHTMLDocument("")).createElement("base")).href = fe.location.href,
        t.head.appendChild(r)) : t = fe),
        o = !n && [],
        (i = xe.exec(e)) ? [t.createElement(i[1])] : (i = b([e], t, o),
        o && o.length && he(o).remove(),
        he.merge([], i.childNodes)));
        var r, i, o
    }
    ,
    he.fn.load = function(e, t, n) {
        var r, i, o, a = this, s = e.indexOf(" ");
        return -1 < s && (r = z(e.slice(s)),
        e = e.slice(0, s)),
        le(t) ? (n = t,
        t = void 0) : t && "object" == typeof t && (i = "POST"),
        0 < a.length && he.ajax({
            url: e,
            type: i || "GET",
            dataType: "html",
            data: t
        }).done(function(e) {
            o = arguments,
            a.html(r ? he("<div>").append(he.parseHTML(e)).find(r) : e)
        }).always(n && function(e, t) {
            a.each(function() {
                n.apply(this, o || [e.responseText, t, e])
            })
        }
        ),
        this
    }
    ,
    he.expr.pseudos.animated = function(e) {
        return he.grep(he.timers, function(t) {
            return e === t.elem
        }).length
    }
    ,
    he.offset = {
        setOffset: function(e, t, n) {
            var r, i, o, a, s, u, l = he.css(e, "position"), c = he(e), f = {};
            "static" === l && (e.style.position = "relative"),
            s = c.offset(),
            o = he.css(e, "top"),
            u = he.css(e, "left"),
            ("absolute" === l || "fixed" === l) && -1 < (o + u).indexOf("auto") ? (a = (r = c.position()).top,
            i = r.left) : (a = parseFloat(o) || 0,
            i = parseFloat(u) || 0),
            le(t) && (t = t.call(e, n, he.extend({}, s))),
            null != t.top && (f.top = t.top - s.top + a),
            null != t.left && (f.left = t.left - s.left + i),
            "using"in t ? t.using.call(e, f) : c.css(f)
        }
    },
    he.fn.extend({
        offset: function(e) {
            if (arguments.length)
                return void 0 === e ? this : this.each(function(t) {
                    he.offset.setOffset(this, e, t)
                });
            var t, n, r = this[0];
            return r ? r.getClientRects().length ? (t = r.getBoundingClientRect(),
            n = r.ownerDocument.defaultView,
            {
                top: t.top + n.pageYOffset,
                left: t.left + n.pageXOffset
            }) : {
                top: 0,
                left: 0
            } : void 0
        },
        position: function() {
            if (this[0]) {
                var e, t, n, r = this[0], i = {
                    top: 0,
                    left: 0
                };
                if ("fixed" === he.css(r, "position"))
                    t = r.getBoundingClientRect();
                else {
                    for (t = this.offset(),
                    n = r.ownerDocument,
                    e = r.offsetParent || n.documentElement; e && (e === n.body || e === n.documentElement) && "static" === he.css(e, "position"); )
                        e = e.parentNode;
                    e && e !== r && 1 === e.nodeType && ((i = he(e).offset()).top += he.css(e, "borderTopWidth", !0),
                    i.left += he.css(e, "borderLeftWidth", !0))
                }
                return {
                    top: t.top - i.top - he.css(r, "marginTop", !0),
                    left: t.left - i.left - he.css(r, "marginLeft", !0)
                }
            }
        },
        offsetParent: function() {
            return this.map(function() {
                for (var e = this.offsetParent; e && "static" === he.css(e, "position"); )
                    e = e.offsetParent;
                return e || Ie
            })
        }
    }),
    he.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(e, t) {
        var n = "pageYOffset" === t;
        he.fn[e] = function(r) {
            return Ae(this, function(e, r, i) {
                var o;
                if (ce(e) ? o = e : 9 === e.nodeType && (o = e.defaultView),
                void 0 === i)
                    return o ? o[t] : e[r];
                o ? o.scrollTo(n ? o.pageXOffset : i, n ? i : o.pageYOffset) : e[r] = i
            }, e, r, arguments.length)
        }
    }),
    he.each(["top", "left"], function(e, t) {
        he.cssHooks[t] = H(ue.pixelPosition, function(e, n) {
            if (n)
                return n = L(e, t),
                et.test(n) ? he(e).position()[t] + "px" : n
        })
    }),
    he.each({
        Height: "height",
        Width: "width"
    }, function(e, t) {
        he.each({
            padding: "inner" + e,
            content: t,
            "": "outer" + e
        }, function(n, r) {
            he.fn[r] = function(i, o) {
                var a = arguments.length && (n || "boolean" != typeof i)
                  , s = n || (!0 === i || !0 === o ? "margin" : "border");
                return Ae(this, function(t, n, i) {
                    var o;
                    return ce(t) ? 0 === r.indexOf("outer") ? t["inner" + e] : t.document.documentElement["client" + e] : 9 === t.nodeType ? (o = t.documentElement,
                    Math.max(t.body["scroll" + e], o["scroll" + e], t.body["offset" + e], o["offset" + e], o["client" + e])) : void 0 === i ? he.css(t, n, s) : he.style(t, n, i, s)
                }, t, a ? i : void 0, a)
            }
        })
    }),
    he.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(e, t) {
        he.fn[t] = function(e) {
            return this.on(t, e)
        }
    }),
    he.fn.extend({
        bind: function(e, t, n) {
            return this.on(e, null, t, n)
        },
        unbind: function(e, t) {
            return this.off(e, null, t)
        },
        delegate: function(e, t, n, r) {
            return this.on(t, e, n, r)
        },
        undelegate: function(e, t, n) {
            return 1 === arguments.length ? this.off(e, "**") : this.off(t, e || "**", n)
        },
        hover: function(e, t) {
            return this.mouseenter(e).mouseleave(t || e)
        }
    }),
    he.each("blur focus focusin focusout resize scroll click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup contextmenu".split(" "), function(e, t) {
        he.fn[t] = function(e, n) {
            return 0 < arguments.length ? this.on(t, null, e, n) : this.trigger(t)
        }
    });
    var Xt = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    he.proxy = function(e, t) {
        var n, r, i;
        if ("string" == typeof t && (n = e[t],
        t = e,
        e = n),
        le(e))
            return r = Z.call(arguments, 2),
            (i = function() {
                return e.apply(t || this, r.concat(Z.call(arguments)))
            }
            ).guid = e.guid = e.guid || he.guid++,
            i
    }
    ,
    he.holdReady = function(e) {
        e ? he.readyWait++ : he.ready(!0)
    }
    ,
    he.isArray = Array.isArray,
    he.parseJSON = JSON.parse,
    he.nodeName = o,
    he.isFunction = le,
    he.isWindow = ce,
    he.camelCase = d,
    he.type = r,
    he.now = Date.now,
    he.isNumeric = function(e) {
        var t = he.type(e);
        return ("number" === t || "string" === t) && !isNaN(e - parseFloat(e))
    }
    ,
    he.trim = function(e) {
        return null == e ? "" : (e + "").replace(Xt, "")
    }
    ,
    "function" == typeof define && define.amd && define("jquery", [], function() {
        return he
    });
    var Vt = e.jQuery
      , Gt = e.$;
    return he.noConflict = function(t) {
        return e.$ === he && (e.$ = Gt),
        t && e.jQuery === he && (e.jQuery = Vt),
        he
    }
    ,
    void 0 === t && (e.jQuery = e.$ = he),
    he
});
!function(e, t) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.moment = t()
}(this, function() {
    "use strict";
    function e() {
        return Ys.apply(null, arguments)
    }
    function t(e) {
        return e instanceof Array || "[object Array]" === Object.prototype.toString.call(e)
    }
    function n(e) {
        return null != e && "[object Object]" === Object.prototype.toString.call(e)
    }
    function s(e) {
        var t;
        for (t in e)
            return !1;
        return !0
    }
    function i(e) {
        return void 0 === e
    }
    function r(e) {
        return "number" == typeof e || "[object Number]" === Object.prototype.toString.call(e)
    }
    function a(e) {
        return e instanceof Date || "[object Date]" === Object.prototype.toString.call(e)
    }
    function o(e, t) {
        var n, s = [];
        for (n = 0; n < e.length; ++n)
            s.push(t(e[n], n));
        return s
    }
    function u(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t)
    }
    function d(e, t) {
        for (var n in t)
            u(t, n) && (e[n] = t[n]);
        return u(t, "toString") && (e.toString = t.toString),
        u(t, "valueOf") && (e.valueOf = t.valueOf),
        e
    }
    function l(e, t, n, s) {
        return gt(e, t, n, s, !0).utc()
    }
    function h() {
        return {
            empty: !1,
            unusedTokens: [],
            unusedInput: [],
            overflow: -2,
            charsLeftOver: 0,
            nullInput: !1,
            invalidMonth: null,
            invalidFormat: !1,
            userInvalidated: !1,
            iso: !1,
            parsedDateParts: [],
            meridiem: null,
            rfc2822: !1,
            weekdayMismatch: !1
        }
    }
    function c(e) {
        return null == e._pf && (e._pf = h()),
        e._pf
    }
    function f(e) {
        if (null == e._isValid) {
            var t = c(e)
              , n = Ss.call(t.parsedDateParts, function(e) {
                return null != e
            })
              , s = !isNaN(e._d.getTime()) && t.overflow < 0 && !t.empty && !t.invalidMonth && !t.invalidWeekday && !t.nullInput && !t.invalidFormat && !t.userInvalidated && (!t.meridiem || t.meridiem && n);
            if (e._strict && (s = s && 0 === t.charsLeftOver && 0 === t.unusedTokens.length && void 0 === t.bigHour),
            null != Object.isFrozen && Object.isFrozen(e))
                return s;
            e._isValid = s
        }
        return e._isValid
    }
    function _(e) {
        var t = l(NaN);
        return null != e ? d(c(t), e) : c(t).userInvalidated = !0,
        t
    }
    function m(e, t) {
        var n, s, r;
        if (i(t._isAMomentObject) || (e._isAMomentObject = t._isAMomentObject),
        i(t._i) || (e._i = t._i),
        i(t._f) || (e._f = t._f),
        i(t._l) || (e._l = t._l),
        i(t._strict) || (e._strict = t._strict),
        i(t._tzm) || (e._tzm = t._tzm),
        i(t._isUTC) || (e._isUTC = t._isUTC),
        i(t._offset) || (e._offset = t._offset),
        i(t._pf) || (e._pf = c(t)),
        i(t._locale) || (e._locale = t._locale),
        Ts.length > 0)
            for (n = 0; n < Ts.length; n++)
                s = Ts[n],
                r = t[s],
                i(r) || (e[s] = r);
        return e
    }
    function y(t) {
        m(this, t),
        this._d = new Date(null != t._d ? t._d.getTime() : NaN),
        this.isValid() || (this._d = new Date(NaN)),
        !1 === Os && (Os = !0,
        e.updateOffset(this),
        Os = !1)
    }
    function g(e) {
        return e instanceof y || null != e && null != e._isAMomentObject
    }
    function M(e) {
        return e < 0 ? Math.ceil(e) || 0 : Math.floor(e)
    }
    function p(e) {
        var t = +e
          , n = 0;
        return 0 !== t && isFinite(t) && (n = M(t)),
        n
    }
    function v(e, t, n) {
        var s, i = Math.min(e.length, t.length), r = Math.abs(e.length - t.length), a = 0;
        for (s = 0; s < i; s++)
            (n && e[s] !== t[s] || !n && p(e[s]) !== p(t[s])) && a++;
        return a + r
    }
    function w(t) {
        !1 === e.suppressDeprecationWarnings && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + t)
    }
    function D(t, n) {
        var s = !0;
        return d(function() {
            if (null != e.deprecationHandler && e.deprecationHandler(null, t),
            s) {
                for (var i, r = [], a = 0; a < arguments.length; a++) {
                    if (i = "",
                    "object" == typeof arguments[a]) {
                        i += "\n[" + a + "] ";
                        for (var o in arguments[0])
                            i += o + ": " + arguments[0][o] + ", ";
                        i = i.slice(0, -2)
                    } else
                        i = arguments[a];
                    r.push(i)
                }
                w(t + "\nArguments: " + Array.prototype.slice.call(r).join("") + "\n" + (new Error).stack),
                s = !1
            }
            return n.apply(this, arguments)
        }, n)
    }
    function Y(t, n) {
        null != e.deprecationHandler && e.deprecationHandler(t, n),
        xs[t] || (w(n),
        xs[t] = !0)
    }
    function k(e) {
        return e instanceof Function || "[object Function]" === Object.prototype.toString.call(e)
    }
    function S(e) {
        var t, n;
        for (n in e)
            t = e[n],
            k(t) ? this[n] = t : this["_" + n] = t;
        this._config = e,
        this._dayOfMonthOrdinalParseLenient = new RegExp((this._dayOfMonthOrdinalParse.source || this._ordinalParse.source) + "|" + /\d{1,2}/.source)
    }
    function T(e, t) {
        var s, i = d({}, e);
        for (s in t)
            u(t, s) && (n(e[s]) && n(t[s]) ? (i[s] = {},
            d(i[s], e[s]),
            d(i[s], t[s])) : null != t[s] ? i[s] = t[s] : delete i[s]);
        for (s in e)
            u(e, s) && !u(t, s) && n(e[s]) && (i[s] = d({}, i[s]));
        return i
    }
    function O(e) {
        null != e && this.set(e)
    }
    function x(e, t, n) {
        var s = this._calendar[e] || this._calendar.sameElse;
        return k(s) ? s.call(t, n) : s
    }
    function L(e) {
        var t = this._longDateFormat[e]
          , n = this._longDateFormat[e.toUpperCase()];
        return t || !n ? t : (this._longDateFormat[e] = n.replace(/MMMM|MM|DD|dddd/g, function(e) {
            return e.slice(1)
        }),
        this._longDateFormat[e])
    }
    function b() {
        return this._invalidDate
    }
    function P(e) {
        return this._ordinal.replace("%d", e)
    }
    function W(e, t, n, s) {
        var i = this._relativeTime[n];
        return k(i) ? i(e, t, n, s) : i.replace(/%d/i, e)
    }
    function H(e, t) {
        var n = this._relativeTime[e > 0 ? "future" : "past"];
        return k(n) ? n(t) : n.replace(/%s/i, t)
    }
    function R(e, t) {
        var n = e.toLowerCase();
        Cs[n] = Cs[n + "s"] = Cs[t] = e
    }
    function F(e) {
        return "string" == typeof e ? Cs[e] || Cs[e.toLowerCase()] : void 0
    }
    function C(e) {
        var t, n, s = {};
        for (n in e)
            u(e, n) && (t = F(n)) && (s[t] = e[n]);
        return s
    }
    function U(e, t) {
        Us[e] = t
    }
    function j(e) {
        var t = [];
        for (var n in e)
            t.push({
                unit: n,
                priority: Us[n]
            });
        return t.sort(function(e, t) {
            return e.priority - t.priority
        }),
        t
    }
    function G(t, n) {
        return function(s) {
            return null != s ? (N(this, t, s),
            e.updateOffset(this, n),
            this) : V(this, t)
        }
    }
    function V(e, t) {
        return e.isValid() ? e._d["get" + (e._isUTC ? "UTC" : "") + t]() : NaN
    }
    function N(e, t, n) {
        e.isValid() && e._d["set" + (e._isUTC ? "UTC" : "") + t](n)
    }
    function E(e) {
        return e = F(e),
        k(this[e]) ? this[e]() : this
    }
    function A(e, t) {
        if ("object" == typeof e) {
            e = C(e);
            for (var n = j(e), s = 0; s < n.length; s++)
                this[n[s].unit](e[n[s].unit])
        } else if (e = F(e),
        k(this[e]))
            return this[e](t);
        return this
    }
    function I(e, t, n) {
        var s = "" + Math.abs(e)
          , i = t - s.length;
        return (e >= 0 ? n ? "+" : "" : "-") + Math.pow(10, Math.max(0, i)).toString().substr(1) + s
    }
    function z(e, t, n, s) {
        var i = s;
        "string" == typeof s && (i = function() {
            return this[s]()
        }
        ),
        e && (Ns[e] = i),
        t && (Ns[t[0]] = function() {
            return I(i.apply(this, arguments), t[1], t[2])
        }
        ),
        n && (Ns[n] = function() {
            return this.localeData().ordinal(i.apply(this, arguments), e)
        }
        )
    }
    function Z(e) {
        return e.match(/\[[\s\S]/) ? e.replace(/^\[|\]$/g, "") : e.replace(/\\/g, "")
    }
    function J(e) {
        var t, n, s = e.match(js);
        for (t = 0,
        n = s.length; t < n; t++)
            Ns[s[t]] ? s[t] = Ns[s[t]] : s[t] = Z(s[t]);
        return function(t) {
            var i, r = "";
            for (i = 0; i < n; i++)
                r += k(s[i]) ? s[i].call(t, e) : s[i];
            return r
        }
    }
    function $(e, t) {
        return e.isValid() ? (t = q(t, e.localeData()),
        Vs[t] = Vs[t] || J(t),
        Vs[t](e)) : e.localeData().invalidDate()
    }
    function q(e, t) {
        function n(e) {
            return t.longDateFormat(e) || e
        }
        var s = 5;
        for (Gs.lastIndex = 0; s >= 0 && Gs.test(e); )
            e = e.replace(Gs, n),
            Gs.lastIndex = 0,
            s -= 1;
        return e
    }
    function B(e, t, n) {
        ri[e] = k(t) ? t : function(e, s) {
            return e && n ? n : t
        }
    }
    function Q(e, t) {
        return u(ri, e) ? ri[e](t._strict, t._locale) : new RegExp(X(e))
    }
    function X(e) {
        return K(e.replace("\\", "").replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(e, t, n, s, i) {
            return t || n || s || i
        }))
    }
    function K(e) {
        return e.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
    }
    function ee(e, t) {
        var n, s = t;
        for ("string" == typeof e && (e = [e]),
        r(t) && (s = function(e, n) {
            n[t] = p(e)
        }
        ),
        n = 0; n < e.length; n++)
            ai[e[n]] = s
    }
    function te(e, t) {
        ee(e, function(e, n, s, i) {
            s._w = s._w || {},
            t(e, s._w, s, i)
        })
    }
    function ne(e, t, n) {
        null != t && u(ai, e) && ai[e](t, n._a, n, e)
    }
    function se(e, t) {
        return new Date(Date.UTC(e, t + 1, 0)).getUTCDate()
    }
    function ie(e, n) {
        return e ? t(this._months) ? this._months[e.month()] : this._months[(this._months.isFormat || gi).test(n) ? "format" : "standalone"][e.month()] : t(this._months) ? this._months : this._months.standalone
    }
    function re(e, n) {
        return e ? t(this._monthsShort) ? this._monthsShort[e.month()] : this._monthsShort[gi.test(n) ? "format" : "standalone"][e.month()] : t(this._monthsShort) ? this._monthsShort : this._monthsShort.standalone
    }
    function ae(e, t, n) {
        var s, i, r, a = e.toLocaleLowerCase();
        if (!this._monthsParse)
            for (this._monthsParse = [],
            this._longMonthsParse = [],
            this._shortMonthsParse = [],
            s = 0; s < 12; ++s)
                r = l([2e3, s]),
                this._shortMonthsParse[s] = this.monthsShort(r, "").toLocaleLowerCase(),
                this._longMonthsParse[s] = this.months(r, "").toLocaleLowerCase();
        return n ? "MMM" === t ? (i = yi.call(this._shortMonthsParse, a),
        -1 !== i ? i : null) : (i = yi.call(this._longMonthsParse, a),
        -1 !== i ? i : null) : "MMM" === t ? -1 !== (i = yi.call(this._shortMonthsParse, a)) ? i : (i = yi.call(this._longMonthsParse, a),
        -1 !== i ? i : null) : -1 !== (i = yi.call(this._longMonthsParse, a)) ? i : (i = yi.call(this._shortMonthsParse, a),
        -1 !== i ? i : null)
    }
    function oe(e, t, n) {
        var s, i, r;
        if (this._monthsParseExact)
            return ae.call(this, e, t, n);
        for (this._monthsParse || (this._monthsParse = [],
        this._longMonthsParse = [],
        this._shortMonthsParse = []),
        s = 0; s < 12; s++) {
            if (i = l([2e3, s]),
            n && !this._longMonthsParse[s] && (this._longMonthsParse[s] = new RegExp("^" + this.months(i, "").replace(".", "") + "$","i"),
            this._shortMonthsParse[s] = new RegExp("^" + this.monthsShort(i, "").replace(".", "") + "$","i")),
            n || this._monthsParse[s] || (r = "^" + this.months(i, "") + "|^" + this.monthsShort(i, ""),
            this._monthsParse[s] = new RegExp(r.replace(".", ""),"i")),
            n && "MMMM" === t && this._longMonthsParse[s].test(e))
                return s;
            if (n && "MMM" === t && this._shortMonthsParse[s].test(e))
                return s;
            if (!n && this._monthsParse[s].test(e))
                return s
        }
    }
    function ue(e, t) {
        var n;
        if (!e.isValid())
            return e;
        if ("string" == typeof t)
            if (/^\d+$/.test(t))
                t = p(t);
            else if (t = e.localeData().monthsParse(t),
            !r(t))
                return e;
        return n = Math.min(e.date(), se(e.year(), t)),
        e._d["set" + (e._isUTC ? "UTC" : "") + "Month"](t, n),
        e
    }
    function de(t) {
        return null != t ? (ue(this, t),
        e.updateOffset(this, !0),
        this) : V(this, "Month")
    }
    function le() {
        return se(this.year(), this.month())
    }
    function he(e) {
        return this._monthsParseExact ? (u(this, "_monthsRegex") || fe.call(this),
        e ? this._monthsShortStrictRegex : this._monthsShortRegex) : (u(this, "_monthsShortRegex") || (this._monthsShortRegex = vi),
        this._monthsShortStrictRegex && e ? this._monthsShortStrictRegex : this._monthsShortRegex)
    }
    function ce(e) {
        return this._monthsParseExact ? (u(this, "_monthsRegex") || fe.call(this),
        e ? this._monthsStrictRegex : this._monthsRegex) : (u(this, "_monthsRegex") || (this._monthsRegex = wi),
        this._monthsStrictRegex && e ? this._monthsStrictRegex : this._monthsRegex)
    }
    function fe() {
        function e(e, t) {
            return t.length - e.length
        }
        var t, n, s = [], i = [], r = [];
        for (t = 0; t < 12; t++)
            n = l([2e3, t]),
            s.push(this.monthsShort(n, "")),
            i.push(this.months(n, "")),
            r.push(this.months(n, "")),
            r.push(this.monthsShort(n, ""));
        for (s.sort(e),
        i.sort(e),
        r.sort(e),
        t = 0; t < 12; t++)
            s[t] = K(s[t]),
            i[t] = K(i[t]);
        for (t = 0; t < 24; t++)
            r[t] = K(r[t]);
        this._monthsRegex = new RegExp("^(" + r.join("|") + ")","i"),
        this._monthsShortRegex = this._monthsRegex,
        this._monthsStrictRegex = new RegExp("^(" + i.join("|") + ")","i"),
        this._monthsShortStrictRegex = new RegExp("^(" + s.join("|") + ")","i")
    }
    function _e(e) {
        return me(e) ? 366 : 365
    }
    function me(e) {
        return e % 4 == 0 && e % 100 != 0 || e % 400 == 0
    }
    function ye() {
        return me(this.year())
    }
    function ge(e, t, n, s, i, r, a) {
        var o = new Date(e,t,n,s,i,r,a);
        return e < 100 && e >= 0 && isFinite(o.getFullYear()) && o.setFullYear(e),
        o
    }
    function Me(e) {
        var t = new Date(Date.UTC.apply(null, arguments));
        return e < 100 && e >= 0 && isFinite(t.getUTCFullYear()) && t.setUTCFullYear(e),
        t
    }
    function pe(e, t, n) {
        var s = 7 + t - n;
        return -(7 + Me(e, 0, s).getUTCDay() - t) % 7 + s - 1
    }
    function ve(e, t, n, s, i) {
        var r, a, o = (7 + n - s) % 7, u = pe(e, s, i), d = 1 + 7 * (t - 1) + o + u;
        return d <= 0 ? (r = e - 1,
        a = _e(r) + d) : d > _e(e) ? (r = e + 1,
        a = d - _e(e)) : (r = e,
        a = d),
        {
            year: r,
            dayOfYear: a
        }
    }
    function we(e, t, n) {
        var s, i, r = pe(e.year(), t, n), a = Math.floor((e.dayOfYear() - r - 1) / 7) + 1;
        return a < 1 ? (i = e.year() - 1,
        s = a + De(i, t, n)) : a > De(e.year(), t, n) ? (s = a - De(e.year(), t, n),
        i = e.year() + 1) : (i = e.year(),
        s = a),
        {
            week: s,
            year: i
        }
    }
    function De(e, t, n) {
        var s = pe(e, t, n)
          , i = pe(e + 1, t, n);
        return (_e(e) - s + i) / 7
    }
    function Ye(e) {
        return we(e, this._week.dow, this._week.doy).week
    }
    function ke() {
        return this._week.dow
    }
    function Se() {
        return this._week.doy
    }
    function Te(e) {
        var t = this.localeData().week(this);
        return null == e ? t : this.add(7 * (e - t), "d")
    }
    function Oe(e) {
        var t = we(this, 1, 4).week;
        return null == e ? t : this.add(7 * (e - t), "d")
    }
    function xe(e, t) {
        return "string" != typeof e ? e : isNaN(e) ? (e = t.weekdaysParse(e),
        "number" == typeof e ? e : null) : parseInt(e, 10)
    }
    function Le(e, t) {
        return "string" == typeof e ? t.weekdaysParse(e) % 7 || 7 : isNaN(e) ? null : e
    }
    function be(e, n) {
        return e ? t(this._weekdays) ? this._weekdays[e.day()] : this._weekdays[this._weekdays.isFormat.test(n) ? "format" : "standalone"][e.day()] : t(this._weekdays) ? this._weekdays : this._weekdays.standalone
    }
    function Pe(e) {
        return e ? this._weekdaysShort[e.day()] : this._weekdaysShort
    }
    function We(e) {
        return e ? this._weekdaysMin[e.day()] : this._weekdaysMin
    }
    function He(e, t, n) {
        var s, i, r, a = e.toLocaleLowerCase();
        if (!this._weekdaysParse)
            for (this._weekdaysParse = [],
            this._shortWeekdaysParse = [],
            this._minWeekdaysParse = [],
            s = 0; s < 7; ++s)
                r = l([2e3, 1]).day(s),
                this._minWeekdaysParse[s] = this.weekdaysMin(r, "").toLocaleLowerCase(),
                this._shortWeekdaysParse[s] = this.weekdaysShort(r, "").toLocaleLowerCase(),
                this._weekdaysParse[s] = this.weekdays(r, "").toLocaleLowerCase();
        return n ? "dddd" === t ? (i = yi.call(this._weekdaysParse, a),
        -1 !== i ? i : null) : "ddd" === t ? (i = yi.call(this._shortWeekdaysParse, a),
        -1 !== i ? i : null) : (i = yi.call(this._minWeekdaysParse, a),
        -1 !== i ? i : null) : "dddd" === t ? -1 !== (i = yi.call(this._weekdaysParse, a)) ? i : -1 !== (i = yi.call(this._shortWeekdaysParse, a)) ? i : (i = yi.call(this._minWeekdaysParse, a),
        -1 !== i ? i : null) : "ddd" === t ? -1 !== (i = yi.call(this._shortWeekdaysParse, a)) ? i : -1 !== (i = yi.call(this._weekdaysParse, a)) ? i : (i = yi.call(this._minWeekdaysParse, a),
        -1 !== i ? i : null) : -1 !== (i = yi.call(this._minWeekdaysParse, a)) ? i : -1 !== (i = yi.call(this._weekdaysParse, a)) ? i : (i = yi.call(this._shortWeekdaysParse, a),
        -1 !== i ? i : null)
    }
    function Re(e, t, n) {
        var s, i, r;
        if (this._weekdaysParseExact)
            return He.call(this, e, t, n);
        for (this._weekdaysParse || (this._weekdaysParse = [],
        this._minWeekdaysParse = [],
        this._shortWeekdaysParse = [],
        this._fullWeekdaysParse = []),
        s = 0; s < 7; s++) {
            if (i = l([2e3, 1]).day(s),
            n && !this._fullWeekdaysParse[s] && (this._fullWeekdaysParse[s] = new RegExp("^" + this.weekdays(i, "").replace(".", ".?") + "$","i"),
            this._shortWeekdaysParse[s] = new RegExp("^" + this.weekdaysShort(i, "").replace(".", ".?") + "$","i"),
            this._minWeekdaysParse[s] = new RegExp("^" + this.weekdaysMin(i, "").replace(".", ".?") + "$","i")),
            this._weekdaysParse[s] || (r = "^" + this.weekdays(i, "") + "|^" + this.weekdaysShort(i, "") + "|^" + this.weekdaysMin(i, ""),
            this._weekdaysParse[s] = new RegExp(r.replace(".", ""),"i")),
            n && "dddd" === t && this._fullWeekdaysParse[s].test(e))
                return s;
            if (n && "ddd" === t && this._shortWeekdaysParse[s].test(e))
                return s;
            if (n && "dd" === t && this._minWeekdaysParse[s].test(e))
                return s;
            if (!n && this._weekdaysParse[s].test(e))
                return s
        }
    }
    function Fe(e) {
        if (!this.isValid())
            return null != e ? this : NaN;
        var t = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
        return null != e ? (e = xe(e, this.localeData()),
        this.add(e - t, "d")) : t
    }
    function Ce(e) {
        if (!this.isValid())
            return null != e ? this : NaN;
        var t = (this.day() + 7 - this.localeData()._week.dow) % 7;
        return null == e ? t : this.add(e - t, "d")
    }
    function Ue(e) {
        if (!this.isValid())
            return null != e ? this : NaN;
        if (null != e) {
            var t = Le(e, this.localeData());
            return this.day(this.day() % 7 ? t : t - 7)
        }
        return this.day() || 7
    }
    function je(e) {
        return this._weekdaysParseExact ? (u(this, "_weekdaysRegex") || Ne.call(this),
        e ? this._weekdaysStrictRegex : this._weekdaysRegex) : (u(this, "_weekdaysRegex") || (this._weekdaysRegex = Oi),
        this._weekdaysStrictRegex && e ? this._weekdaysStrictRegex : this._weekdaysRegex)
    }
    function Ge(e) {
        return this._weekdaysParseExact ? (u(this, "_weekdaysRegex") || Ne.call(this),
        e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex) : (u(this, "_weekdaysShortRegex") || (this._weekdaysShortRegex = xi),
        this._weekdaysShortStrictRegex && e ? this._weekdaysShortStrictRegex : this._weekdaysShortRegex)
    }
    function Ve(e) {
        return this._weekdaysParseExact ? (u(this, "_weekdaysRegex") || Ne.call(this),
        e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex) : (u(this, "_weekdaysMinRegex") || (this._weekdaysMinRegex = Li),
        this._weekdaysMinStrictRegex && e ? this._weekdaysMinStrictRegex : this._weekdaysMinRegex)
    }
    function Ne() {
        function e(e, t) {
            return t.length - e.length
        }
        var t, n, s, i, r, a = [], o = [], u = [], d = [];
        for (t = 0; t < 7; t++)
            n = l([2e3, 1]).day(t),
            s = this.weekdaysMin(n, ""),
            i = this.weekdaysShort(n, ""),
            r = this.weekdays(n, ""),
            a.push(s),
            o.push(i),
            u.push(r),
            d.push(s),
            d.push(i),
            d.push(r);
        for (a.sort(e),
        o.sort(e),
        u.sort(e),
        d.sort(e),
        t = 0; t < 7; t++)
            o[t] = K(o[t]),
            u[t] = K(u[t]),
            d[t] = K(d[t]);
        this._weekdaysRegex = new RegExp("^(" + d.join("|") + ")","i"),
        this._weekdaysShortRegex = this._weekdaysRegex,
        this._weekdaysMinRegex = this._weekdaysRegex,
        this._weekdaysStrictRegex = new RegExp("^(" + u.join("|") + ")","i"),
        this._weekdaysShortStrictRegex = new RegExp("^(" + o.join("|") + ")","i"),
        this._weekdaysMinStrictRegex = new RegExp("^(" + a.join("|") + ")","i")
    }
    function Ee() {
        return this.hours() % 12 || 12
    }
    function Ae() {
        return this.hours() || 24
    }
    function Ie(e, t) {
        z(e, 0, 0, function() {
            return this.localeData().meridiem(this.hours(), this.minutes(), t)
        })
    }
    function ze(e, t) {
        return t._meridiemParse
    }
    function Ze(e) {
        return "p" === (e + "").toLowerCase().charAt(0)
    }
    function Je(e, t, n) {
        return e > 11 ? n ? "pm" : "PM" : n ? "am" : "AM"
    }
    function $e(e) {
        return e ? e.toLowerCase().replace("_", "-") : e
    }
    function qe(e) {
        for (var t, n, s, i, r = 0; r < e.length; ) {
            for (i = $e(e[r]).split("-"),
            t = i.length,
            n = $e(e[r + 1]),
            n = n ? n.split("-") : null; t > 0; ) {
                if (s = Be(i.slice(0, t).join("-")))
                    return s;
                if (n && n.length >= t && v(i, n, !0) >= t - 1)
                    break;
                t--
            }
            r++
        }
        return null
    }
    function Be(e) {
        var t = null;
        if (!Ri[e] && "undefined" != typeof module && module && module.exports)
            try {
                t = bi._abbr,
                require("./locale/" + e),
                Qe(t)
            } catch (e) {}
        return Ri[e]
    }
    function Qe(e, t) {
        var n;
        return e && (n = i(t) ? et(e) : Xe(e, t)) && (bi = n),
        bi._abbr
    }
    function Xe(e, t) {
        if (null !== t) {
            var n = Hi;
            if (t.abbr = e,
            null != Ri[e])
                Y("defineLocaleOverride", "use moment.updateLocale(localeName, config) to change an existing locale. moment.defineLocale(localeName, config) should only be used for creating a new locale See http://momentjs.com/guides/#/warnings/define-locale/ for more info."),
                n = Ri[e]._config;
            else if (null != t.parentLocale) {
                if (null == Ri[t.parentLocale])
                    return Fi[t.parentLocale] || (Fi[t.parentLocale] = []),
                    Fi[t.parentLocale].push({
                        name: e,
                        config: t
                    }),
                    null;
                n = Ri[t.parentLocale]._config
            }
            return Ri[e] = new O(T(n, t)),
            Fi[e] && Fi[e].forEach(function(e) {
                Xe(e.name, e.config)
            }),
            Qe(e),
            Ri[e]
        }
        return delete Ri[e],
        null
    }
    function Ke(e, t) {
        if (null != t) {
            var n, s = Hi;
            null != Ri[e] && (s = Ri[e]._config),
            t = T(s, t),
            n = new O(t),
            n.parentLocale = Ri[e],
            Ri[e] = n,
            Qe(e)
        } else
            null != Ri[e] && (null != Ri[e].parentLocale ? Ri[e] = Ri[e].parentLocale : null != Ri[e] && delete Ri[e]);
        return Ri[e]
    }
    function et(e) {
        var n;
        if (e && e._locale && e._locale._abbr && (e = e._locale._abbr),
        !e)
            return bi;
        if (!t(e)) {
            if (n = Be(e))
                return n;
            e = [e]
        }
        return qe(e)
    }
    function tt() {
        return Ps(Ri)
    }
    function nt(e) {
        var t, n = e._a;
        return n && -2 === c(e).overflow && (t = n[ui] < 0 || n[ui] > 11 ? ui : n[di] < 1 || n[di] > se(n[oi], n[ui]) ? di : n[li] < 0 || n[li] > 24 || 24 === n[li] && (0 !== n[hi] || 0 !== n[ci] || 0 !== n[fi]) ? li : n[hi] < 0 || n[hi] > 59 ? hi : n[ci] < 0 || n[ci] > 59 ? ci : n[fi] < 0 || n[fi] > 999 ? fi : -1,
        c(e)._overflowDayOfYear && (t < oi || t > di) && (t = di),
        c(e)._overflowWeeks && -1 === t && (t = _i),
        c(e)._overflowWeekday && -1 === t && (t = mi),
        c(e).overflow = t),
        e
    }
    function st(e) {
        var t, n, s, i, r, a, o = e._i, u = Ci.exec(o) || Ui.exec(o);
        if (u) {
            for (c(e).iso = !0,
            t = 0,
            n = Gi.length; t < n; t++)
                if (Gi[t][1].exec(u[1])) {
                    i = Gi[t][0],
                    s = !1 !== Gi[t][2];
                    break
                }
            if (null == i)
                return void (e._isValid = !1);
            if (u[3]) {
                for (t = 0,
                n = Vi.length; t < n; t++)
                    if (Vi[t][1].exec(u[3])) {
                        r = (u[2] || " ") + Vi[t][0];
                        break
                    }
                if (null == r)
                    return void (e._isValid = !1)
            }
            if (!s && null != r)
                return void (e._isValid = !1);
            if (u[4]) {
                if (!ji.exec(u[4]))
                    return void (e._isValid = !1);
                a = "Z"
            }
            e._f = i + (r || "") + (a || ""),
            lt(e)
        } else
            e._isValid = !1
    }
    function it(e) {
        var t, n, s, i, r, a, o, u, d = {
            " GMT": " +0000",
            " EDT": " -0400",
            " EST": " -0500",
            " CDT": " -0500",
            " CST": " -0600",
            " MDT": " -0600",
            " MST": " -0700",
            " PDT": " -0700",
            " PST": " -0800"
        }, l = "YXWVUTSRQPONZABCDEFGHIKLM";
        if (t = e._i.replace(/\([^\)]*\)|[\n\t]/g, " ").replace(/(\s\s+)/g, " ").replace(/^\s|\s$/g, ""),
        n = Ei.exec(t)) {
            if (s = n[1] ? "ddd" + (5 === n[1].length ? ", " : " ") : "",
            i = "D MMM " + (n[2].length > 10 ? "YYYY " : "YY "),
            r = "HH:mm" + (n[4] ? ":ss" : ""),
            n[1]) {
                var h = new Date(n[2])
                  , f = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][h.getDay()];
                if (n[1].substr(0, 3) !== f)
                    return c(e).weekdayMismatch = !0,
                    void (e._isValid = !1)
            }
            switch (n[5].length) {
            case 2:
                0 === u ? o = " +0000" : (u = l.indexOf(n[5][1].toUpperCase()) - 12,
                o = (u < 0 ? " -" : " +") + ("" + u).replace(/^-?/, "0").match(/..$/)[0] + "00");
                break;
            case 4:
                o = d[n[5]];
                break;
            default:
                o = d[" GMT"]
            }
            n[5] = o,
            e._i = n.splice(1).join(""),
            a = " ZZ",
            e._f = s + i + r + a,
            lt(e),
            c(e).rfc2822 = !0
        } else
            e._isValid = !1
    }
    function rt(t) {
        var n = Ni.exec(t._i);
        if (null !== n)
            return void (t._d = new Date(+n[1]));
        st(t),
        !1 === t._isValid && (delete t._isValid,
        it(t),
        !1 === t._isValid && (delete t._isValid,
        e.createFromInputFallback(t)))
    }
    function at(e, t, n) {
        return null != e ? e : null != t ? t : n
    }
    function ot(t) {
        var n = new Date(e.now());
        return t._useUTC ? [n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate()] : [n.getFullYear(), n.getMonth(), n.getDate()]
    }
    function ut(e) {
        var t, n, s, i, r = [];
        if (!e._d) {
            for (s = ot(e),
            e._w && null == e._a[di] && null == e._a[ui] && dt(e),
            null != e._dayOfYear && (i = at(e._a[oi], s[oi]),
            (e._dayOfYear > _e(i) || 0 === e._dayOfYear) && (c(e)._overflowDayOfYear = !0),
            n = Me(i, 0, e._dayOfYear),
            e._a[ui] = n.getUTCMonth(),
            e._a[di] = n.getUTCDate()),
            t = 0; t < 3 && null == e._a[t]; ++t)
                e._a[t] = r[t] = s[t];
            for (; t < 7; t++)
                e._a[t] = r[t] = null == e._a[t] ? 2 === t ? 1 : 0 : e._a[t];
            24 === e._a[li] && 0 === e._a[hi] && 0 === e._a[ci] && 0 === e._a[fi] && (e._nextDay = !0,
            e._a[li] = 0),
            e._d = (e._useUTC ? Me : ge).apply(null, r),
            null != e._tzm && e._d.setUTCMinutes(e._d.getUTCMinutes() - e._tzm),
            e._nextDay && (e._a[li] = 24)
        }
    }
    function dt(e) {
        var t, n, s, i, r, a, o, u;
        if (t = e._w,
        null != t.GG || null != t.W || null != t.E)
            r = 1,
            a = 4,
            n = at(t.GG, e._a[oi], we(Mt(), 1, 4).year),
            s = at(t.W, 1),
            ((i = at(t.E, 1)) < 1 || i > 7) && (u = !0);
        else {
            r = e._locale._week.dow,
            a = e._locale._week.doy;
            var d = we(Mt(), r, a);
            n = at(t.gg, e._a[oi], d.year),
            s = at(t.w, d.week),
            null != t.d ? ((i = t.d) < 0 || i > 6) && (u = !0) : null != t.e ? (i = t.e + r,
            (t.e < 0 || t.e > 6) && (u = !0)) : i = r
        }
        s < 1 || s > De(n, r, a) ? c(e)._overflowWeeks = !0 : null != u ? c(e)._overflowWeekday = !0 : (o = ve(n, s, i, r, a),
        e._a[oi] = o.year,
        e._dayOfYear = o.dayOfYear)
    }
    function lt(t) {
        if (t._f === e.ISO_8601)
            return void st(t);
        if (t._f === e.RFC_2822)
            return void it(t);
        t._a = [],
        c(t).empty = !0;
        var n, s, i, r, a, o = "" + t._i, u = o.length, d = 0;
        for (i = q(t._f, t._locale).match(js) || [],
        n = 0; n < i.length; n++)
            r = i[n],
            s = (o.match(Q(r, t)) || [])[0],
            s && (a = o.substr(0, o.indexOf(s)),
            a.length > 0 && c(t).unusedInput.push(a),
            o = o.slice(o.indexOf(s) + s.length),
            d += s.length),
            Ns[r] ? (s ? c(t).empty = !1 : c(t).unusedTokens.push(r),
            ne(r, s, t)) : t._strict && !s && c(t).unusedTokens.push(r);
        c(t).charsLeftOver = u - d,
        o.length > 0 && c(t).unusedInput.push(o),
        t._a[li] <= 12 && !0 === c(t).bigHour && t._a[li] > 0 && (c(t).bigHour = void 0),
        c(t).parsedDateParts = t._a.slice(0),
        c(t).meridiem = t._meridiem,
        t._a[li] = ht(t._locale, t._a[li], t._meridiem),
        ut(t),
        nt(t)
    }
    function ht(e, t, n) {
        var s;
        return null == n ? t : null != e.meridiemHour ? e.meridiemHour(t, n) : null != e.isPM ? (s = e.isPM(n),
        s && t < 12 && (t += 12),
        s || 12 !== t || (t = 0),
        t) : t
    }
    function ct(e) {
        var t, n, s, i, r;
        if (0 === e._f.length)
            return c(e).invalidFormat = !0,
            void (e._d = new Date(NaN));
        for (i = 0; i < e._f.length; i++)
            r = 0,
            t = m({}, e),
            null != e._useUTC && (t._useUTC = e._useUTC),
            t._f = e._f[i],
            lt(t),
            f(t) && (r += c(t).charsLeftOver,
            r += 10 * c(t).unusedTokens.length,
            c(t).score = r,
            (null == s || r < s) && (s = r,
            n = t));
        d(e, n || t)
    }
    function ft(e) {
        if (!e._d) {
            var t = C(e._i);
            e._a = o([t.year, t.month, t.day || t.date, t.hour, t.minute, t.second, t.millisecond], function(e) {
                return e && parseInt(e, 10)
            }),
            ut(e)
        }
    }
    function _t(e) {
        var t = new y(nt(mt(e)));
        return t._nextDay && (t.add(1, "d"),
        t._nextDay = void 0),
        t
    }
    function mt(e) {
        var n = e._i
          , s = e._f;
        return e._locale = e._locale || et(e._l),
        null === n || void 0 === s && "" === n ? _({
            nullInput: !0
        }) : ("string" == typeof n && (e._i = n = e._locale.preparse(n)),
        g(n) ? new y(nt(n)) : (a(n) ? e._d = n : t(s) ? ct(e) : s ? lt(e) : yt(e),
        f(e) || (e._d = null),
        e))
    }
    function yt(s) {
        var u = s._i;
        i(u) ? s._d = new Date(e.now()) : a(u) ? s._d = new Date(u.valueOf()) : "string" == typeof u ? rt(s) : t(u) ? (s._a = o(u.slice(0), function(e) {
            return parseInt(e, 10)
        }),
        ut(s)) : n(u) ? ft(s) : r(u) ? s._d = new Date(u) : e.createFromInputFallback(s)
    }
    function gt(e, i, r, a, o) {
        var u = {};
        return !0 !== r && !1 !== r || (a = r,
        r = void 0),
        (n(e) && s(e) || t(e) && 0 === e.length) && (e = void 0),
        u._isAMomentObject = !0,
        u._useUTC = u._isUTC = o,
        u._l = r,
        u._i = e,
        u._f = i,
        u._strict = a,
        _t(u)
    }
    function Mt(e, t, n, s) {
        return gt(e, t, n, s, !1)
    }
    function pt(e, n) {
        var s, i;
        if (1 === n.length && t(n[0]) && (n = n[0]),
        !n.length)
            return Mt();
        for (s = n[0],
        i = 1; i < n.length; ++i)
            n[i].isValid() && !n[i][e](s) || (s = n[i]);
        return s
    }
    function vt() {
        return pt("isBefore", [].slice.call(arguments, 0))
    }
    function wt() {
        return pt("isAfter", [].slice.call(arguments, 0))
    }
    function Dt(e) {
        for (var t in e)
            if (-1 === Zi.indexOf(t) || null != e[t] && isNaN(e[t]))
                return !1;
        for (var n = !1, s = 0; s < Zi.length; ++s)
            if (e[Zi[s]]) {
                if (n)
                    return !1;
                parseFloat(e[Zi[s]]) !== p(e[Zi[s]]) && (n = !0)
            }
        return !0
    }
    function Yt() {
        return this._isValid
    }
    function kt() {
        return At(NaN)
    }
    function St(e) {
        var t = C(e)
          , n = t.year || 0
          , s = t.quarter || 0
          , i = t.month || 0
          , r = t.week || 0
          , a = t.day || 0
          , o = t.hour || 0
          , u = t.minute || 0
          , d = t.second || 0
          , l = t.millisecond || 0;
        this._isValid = Dt(t),
        this._milliseconds = +l + 1e3 * d + 6e4 * u + 1e3 * o * 60 * 60,
        this._days = +a + 7 * r,
        this._months = +i + 3 * s + 12 * n,
        this._data = {},
        this._locale = et(),
        this._bubble()
    }
    function Tt(e) {
        return e instanceof St
    }
    function Ot(e) {
        return e < 0 ? -1 * Math.round(-1 * e) : Math.round(e)
    }
    function xt(e, t) {
        z(e, 0, 0, function() {
            var e = this.utcOffset()
              , n = "+";
            return e < 0 && (e = -e,
            n = "-"),
            n + I(~~(e / 60), 2) + t + I(~~e % 60, 2)
        })
    }
    function Lt(e, t) {
        var n = (t || "").match(e);
        if (null === n)
            return null;
        var s = n[n.length - 1] || []
          , i = (s + "").match(Ji) || ["-", 0, 0]
          , r = 60 * i[1] + p(i[2]);
        return 0 === r ? 0 : "+" === i[0] ? r : -r
    }
    function bt(t, n) {
        var s, i;
        return n._isUTC ? (s = n.clone(),
        i = (g(t) || a(t) ? t.valueOf() : Mt(t).valueOf()) - s.valueOf(),
        s._d.setTime(s._d.valueOf() + i),
        e.updateOffset(s, !1),
        s) : Mt(t).local()
    }
    function Pt(e) {
        return 15 * -Math.round(e._d.getTimezoneOffset() / 15)
    }
    function Wt(t, n, s) {
        var i, r = this._offset || 0;
        if (!this.isValid())
            return null != t ? this : NaN;
        if (null != t) {
            if ("string" == typeof t) {
                if (null === (t = Lt(ni, t)))
                    return this
            } else
                Math.abs(t) < 16 && !s && (t *= 60);
            return !this._isUTC && n && (i = Pt(this)),
            this._offset = t,
            this._isUTC = !0,
            null != i && this.add(i, "m"),
            r !== t && (!n || this._changeInProgress ? $t(this, At(t - r, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0,
            e.updateOffset(this, !0),
            this._changeInProgress = null)),
            this
        }
        return this._isUTC ? r : Pt(this)
    }
    function Ht(e, t) {
        return null != e ? ("string" != typeof e && (e = -e),
        this.utcOffset(e, t),
        this) : -this.utcOffset()
    }
    function Rt(e) {
        return this.utcOffset(0, e)
    }
    function Ft(e) {
        return this._isUTC && (this.utcOffset(0, e),
        this._isUTC = !1,
        e && this.subtract(Pt(this), "m")),
        this
    }
    function Ct() {
        if (null != this._tzm)
            this.utcOffset(this._tzm, !1, !0);
        else if ("string" == typeof this._i) {
            var e = Lt(ti, this._i);
            null != e ? this.utcOffset(e) : this.utcOffset(0, !0)
        }
        return this
    }
    function Ut(e) {
        return !!this.isValid() && (e = e ? Mt(e).utcOffset() : 0,
        (this.utcOffset() - e) % 60 == 0)
    }
    function jt() {
        return this.utcOffset() > this.clone().month(0).utcOffset() || this.utcOffset() > this.clone().month(5).utcOffset()
    }
    function Gt() {
        if (!i(this._isDSTShifted))
            return this._isDSTShifted;
        var e = {};
        if (m(e, this),
        e = mt(e),
        e._a) {
            var t = e._isUTC ? l(e._a) : Mt(e._a);
            this._isDSTShifted = this.isValid() && v(e._a, t.toArray()) > 0
        } else
            this._isDSTShifted = !1;
        return this._isDSTShifted
    }
    function Vt() {
        return !!this.isValid() && !this._isUTC
    }
    function Nt() {
        return !!this.isValid() && this._isUTC
    }
    function Et() {
        return !!this.isValid() && (this._isUTC && 0 === this._offset)
    }
    function At(e, t) {
        var n, s, i, a = e, o = null;
        return Tt(e) ? a = {
            ms: e._milliseconds,
            d: e._days,
            M: e._months
        } : r(e) ? (a = {},
        t ? a[t] = e : a.milliseconds = e) : (o = $i.exec(e)) ? (n = "-" === o[1] ? -1 : 1,
        a = {
            y: 0,
            d: p(o[di]) * n,
            h: p(o[li]) * n,
            m: p(o[hi]) * n,
            s: p(o[ci]) * n,
            ms: p(Ot(1e3 * o[fi])) * n
        }) : (o = qi.exec(e)) ? (n = "-" === o[1] ? -1 : 1,
        a = {
            y: It(o[2], n),
            M: It(o[3], n),
            w: It(o[4], n),
            d: It(o[5], n),
            h: It(o[6], n),
            m: It(o[7], n),
            s: It(o[8], n)
        }) : null == a ? a = {} : "object" == typeof a && ("from"in a || "to"in a) && (i = Zt(Mt(a.from), Mt(a.to)),
        a = {},
        a.ms = i.milliseconds,
        a.M = i.months),
        s = new St(a),
        Tt(e) && u(e, "_locale") && (s._locale = e._locale),
        s
    }
    function It(e, t) {
        var n = e && parseFloat(e.replace(",", "."));
        return (isNaN(n) ? 0 : n) * t
    }
    function zt(e, t) {
        var n = {
            milliseconds: 0,
            months: 0
        };
        return n.months = t.month() - e.month() + 12 * (t.year() - e.year()),
        e.clone().add(n.months, "M").isAfter(t) && --n.months,
        n.milliseconds = +t - +e.clone().add(n.months, "M"),
        n
    }
    function Zt(e, t) {
        var n;
        return e.isValid() && t.isValid() ? (t = bt(t, e),
        e.isBefore(t) ? n = zt(e, t) : (n = zt(t, e),
        n.milliseconds = -n.milliseconds,
        n.months = -n.months),
        n) : {
            milliseconds: 0,
            months: 0
        }
    }
    function Jt(e, t) {
        return function(n, s) {
            var i, r;
            return null === s || isNaN(+s) || (Y(t, "moment()." + t + "(period, number) is deprecated. Please use moment()." + t + "(number, period). See http://momentjs.com/guides/#/warnings/add-inverted-param/ for more info."),
            r = n,
            n = s,
            s = r),
            n = "string" == typeof n ? +n : n,
            i = At(n, s),
            $t(this, i, e),
            this
        }
    }
    function $t(t, n, s, i) {
        var r = n._milliseconds
          , a = Ot(n._days)
          , o = Ot(n._months);
        t.isValid() && (i = null == i || i,
        r && t._d.setTime(t._d.valueOf() + r * s),
        a && N(t, "Date", V(t, "Date") + a * s),
        o && ue(t, V(t, "Month") + o * s),
        i && e.updateOffset(t, a || o))
    }
    function qt(e, t) {
        var n = e.diff(t, "days", !0);
        return n < -6 ? "sameElse" : n < -1 ? "lastWeek" : n < 0 ? "lastDay" : n < 1 ? "sameDay" : n < 2 ? "nextDay" : n < 7 ? "nextWeek" : "sameElse"
    }
    function Bt(t, n) {
        var s = t || Mt()
          , i = bt(s, this).startOf("day")
          , r = e.calendarFormat(this, i) || "sameElse"
          , a = n && (k(n[r]) ? n[r].call(this, s) : n[r]);
        return this.format(a || this.localeData().calendar(r, this, Mt(s)))
    }
    function Qt() {
        return new y(this)
    }
    function Xt(e, t) {
        var n = g(e) ? e : Mt(e);
        return !(!this.isValid() || !n.isValid()) && (t = F(i(t) ? "millisecond" : t),
        "millisecond" === t ? this.valueOf() > n.valueOf() : n.valueOf() < this.clone().startOf(t).valueOf())
    }
    function Kt(e, t) {
        var n = g(e) ? e : Mt(e);
        return !(!this.isValid() || !n.isValid()) && (t = F(i(t) ? "millisecond" : t),
        "millisecond" === t ? this.valueOf() < n.valueOf() : this.clone().endOf(t).valueOf() < n.valueOf())
    }
    function en(e, t, n, s) {
        return s = s || "()",
        ("(" === s[0] ? this.isAfter(e, n) : !this.isBefore(e, n)) && (")" === s[1] ? this.isBefore(t, n) : !this.isAfter(t, n))
    }
    function tn(e, t) {
        var n, s = g(e) ? e : Mt(e);
        return !(!this.isValid() || !s.isValid()) && (t = F(t || "millisecond"),
        "millisecond" === t ? this.valueOf() === s.valueOf() : (n = s.valueOf(),
        this.clone().startOf(t).valueOf() <= n && n <= this.clone().endOf(t).valueOf()))
    }
    function nn(e, t) {
        return this.isSame(e, t) || this.isAfter(e, t)
    }
    function sn(e, t) {
        return this.isSame(e, t) || this.isBefore(e, t)
    }
    function rn(e, t, n) {
        var s, i, r, a;
        return this.isValid() ? (s = bt(e, this),
        s.isValid() ? (i = 6e4 * (s.utcOffset() - this.utcOffset()),
        t = F(t),
        "year" === t || "month" === t || "quarter" === t ? (a = an(this, s),
        "quarter" === t ? a /= 3 : "year" === t && (a /= 12)) : (r = this - s,
        a = "second" === t ? r / 1e3 : "minute" === t ? r / 6e4 : "hour" === t ? r / 36e5 : "day" === t ? (r - i) / 864e5 : "week" === t ? (r - i) / 6048e5 : r),
        n ? a : M(a)) : NaN) : NaN
    }
    function an(e, t) {
        var n, s, i = 12 * (t.year() - e.year()) + (t.month() - e.month()), r = e.clone().add(i, "months");
        return t - r < 0 ? (n = e.clone().add(i - 1, "months"),
        s = (t - r) / (r - n)) : (n = e.clone().add(i + 1, "months"),
        s = (t - r) / (n - r)),
        -(i + s) || 0
    }
    function on() {
        return this.clone().locale("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
    }
    function un() {
        if (!this.isValid())
            return null;
        var e = this.clone().utc();
        return e.year() < 0 || e.year() > 9999 ? $(e, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : k(Date.prototype.toISOString) ? this.toDate().toISOString() : $(e, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
    }
    function dn() {
        if (!this.isValid())
            return "moment.invalid(/* " + this._i + " */)";
        var e = "moment"
          , t = "";
        this.isLocal() || (e = 0 === this.utcOffset() ? "moment.utc" : "moment.parseZone",
        t = "Z");
        var n = "[" + e + '("]'
          , s = 0 <= this.year() && this.year() <= 9999 ? "YYYY" : "YYYYYY"
          , i = t + '[")]';
        return this.format(n + s + "-MM-DD[T]HH:mm:ss.SSS" + i)
    }
    function ln(t) {
        t || (t = this.isUtc() ? e.defaultFormatUtc : e.defaultFormat);
        var n = $(this, t);
        return this.localeData().postformat(n)
    }
    function hn(e, t) {
        return this.isValid() && (g(e) && e.isValid() || Mt(e).isValid()) ? At({
            to: this,
            from: e
        }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate()
    }
    function cn(e) {
        return this.from(Mt(), e)
    }
    function fn(e, t) {
        return this.isValid() && (g(e) && e.isValid() || Mt(e).isValid()) ? At({
            from: this,
            to: e
        }).locale(this.locale()).humanize(!t) : this.localeData().invalidDate()
    }
    function _n(e) {
        return this.to(Mt(), e)
    }
    function mn(e) {
        var t;
        return void 0 === e ? this._locale._abbr : (t = et(e),
        null != t && (this._locale = t),
        this)
    }
    function yn() {
        return this._locale
    }
    function gn(e) {
        switch (e = F(e)) {
        case "year":
            this.month(0);
        case "quarter":
        case "month":
            this.date(1);
        case "week":
        case "isoWeek":
        case "day":
        case "date":
            this.hours(0);
        case "hour":
            this.minutes(0);
        case "minute":
            this.seconds(0);
        case "second":
            this.milliseconds(0)
        }
        return "week" === e && this.weekday(0),
        "isoWeek" === e && this.isoWeekday(1),
        "quarter" === e && this.month(3 * Math.floor(this.month() / 3)),
        this
    }
    function Mn(e) {
        return void 0 === (e = F(e)) || "millisecond" === e ? this : ("date" === e && (e = "day"),
        this.startOf(e).add(1, "isoWeek" === e ? "week" : e).subtract(1, "ms"))
    }
    function pn() {
        return this._d.valueOf() - 6e4 * (this._offset || 0)
    }
    function vn() {
        return Math.floor(this.valueOf() / 1e3)
    }
    function wn() {
        return new Date(this.valueOf())
    }
    function Dn() {
        var e = this;
        return [e.year(), e.month(), e.date(), e.hour(), e.minute(), e.second(), e.millisecond()]
    }
    function Yn() {
        var e = this;
        return {
            years: e.year(),
            months: e.month(),
            date: e.date(),
            hours: e.hours(),
            minutes: e.minutes(),
            seconds: e.seconds(),
            milliseconds: e.milliseconds()
        }
    }
    function kn() {
        return this.isValid() ? this.toISOString() : null
    }
    function Sn() {
        return f(this)
    }
    function Tn() {
        return d({}, c(this))
    }
    function On() {
        return c(this).overflow
    }
    function xn() {
        return {
            input: this._i,
            format: this._f,
            locale: this._locale,
            isUTC: this._isUTC,
            strict: this._strict
        }
    }
    function Ln(e, t) {
        z(0, [e, e.length], 0, t)
    }
    function bn(e) {
        return Rn.call(this, e, this.week(), this.weekday(), this.localeData()._week.dow, this.localeData()._week.doy)
    }
    function Pn(e) {
        return Rn.call(this, e, this.isoWeek(), this.isoWeekday(), 1, 4)
    }
    function Wn() {
        return De(this.year(), 1, 4)
    }
    function Hn() {
        var e = this.localeData()._week;
        return De(this.year(), e.dow, e.doy)
    }
    function Rn(e, t, n, s, i) {
        var r;
        return null == e ? we(this, s, i).year : (r = De(e, s, i),
        t > r && (t = r),
        Fn.call(this, e, t, n, s, i))
    }
    function Fn(e, t, n, s, i) {
        var r = ve(e, t, n, s, i)
          , a = Me(r.year, 0, r.dayOfYear);
        return this.year(a.getUTCFullYear()),
        this.month(a.getUTCMonth()),
        this.date(a.getUTCDate()),
        this
    }
    function Cn(e) {
        return null == e ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (e - 1) + this.month() % 3)
    }
    function Un(e) {
        var t = Math.round((this.clone().startOf("day") - this.clone().startOf("year")) / 864e5) + 1;
        return null == e ? t : this.add(e - t, "d")
    }
    function jn(e, t) {
        t[fi] = p(1e3 * ("0." + e))
    }
    function Gn() {
        return this._isUTC ? "UTC" : ""
    }
    function Vn() {
        return this._isUTC ? "Coordinated Universal Time" : ""
    }
    function Nn(e) {
        return Mt(1e3 * e)
    }
    function En() {
        return Mt.apply(null, arguments).parseZone()
    }
    function An(e) {
        return e
    }
    function In(e, t, n, s) {
        var i = et()
          , r = l().set(s, t);
        return i[n](r, e)
    }
    function zn(e, t, n) {
        if (r(e) && (t = e,
        e = void 0),
        e = e || "",
        null != t)
            return In(e, t, n, "month");
        var s, i = [];
        for (s = 0; s < 12; s++)
            i[s] = In(e, s, n, "month");
        return i
    }
    function Zn(e, t, n, s) {
        "boolean" == typeof e ? (r(t) && (n = t,
        t = void 0),
        t = t || "") : (t = e,
        n = t,
        e = !1,
        r(t) && (n = t,
        t = void 0),
        t = t || "");
        var i = et()
          , a = e ? i._week.dow : 0;
        if (null != n)
            return In(t, (n + a) % 7, s, "day");
        var o, u = [];
        for (o = 0; o < 7; o++)
            u[o] = In(t, (o + a) % 7, s, "day");
        return u
    }
    function Jn(e, t) {
        return zn(e, t, "months")
    }
    function $n(e, t) {
        return zn(e, t, "monthsShort")
    }
    function qn(e, t, n) {
        return Zn(e, t, n, "weekdays")
    }
    function Bn(e, t, n) {
        return Zn(e, t, n, "weekdaysShort")
    }
    function Qn(e, t, n) {
        return Zn(e, t, n, "weekdaysMin")
    }
    function Xn() {
        var e = this._data;
        return this._milliseconds = ar(this._milliseconds),
        this._days = ar(this._days),
        this._months = ar(this._months),
        e.milliseconds = ar(e.milliseconds),
        e.seconds = ar(e.seconds),
        e.minutes = ar(e.minutes),
        e.hours = ar(e.hours),
        e.months = ar(e.months),
        e.years = ar(e.years),
        this
    }
    function Kn(e, t, n, s) {
        var i = At(t, n);
        return e._milliseconds += s * i._milliseconds,
        e._days += s * i._days,
        e._months += s * i._months,
        e._bubble()
    }
    function es(e, t) {
        return Kn(this, e, t, 1)
    }
    function ts(e, t) {
        return Kn(this, e, t, -1)
    }
    function ns(e) {
        return e < 0 ? Math.floor(e) : Math.ceil(e)
    }
    function ss() {
        var e, t, n, s, i, r = this._milliseconds, a = this._days, o = this._months, u = this._data;
        return r >= 0 && a >= 0 && o >= 0 || r <= 0 && a <= 0 && o <= 0 || (r += 864e5 * ns(rs(o) + a),
        a = 0,
        o = 0),
        u.milliseconds = r % 1e3,
        e = M(r / 1e3),
        u.seconds = e % 60,
        t = M(e / 60),
        u.minutes = t % 60,
        n = M(t / 60),
        u.hours = n % 24,
        a += M(n / 24),
        i = M(is(a)),
        o += i,
        a -= ns(rs(i)),
        s = M(o / 12),
        o %= 12,
        u.days = a,
        u.months = o,
        u.years = s,
        this
    }
    function is(e) {
        return 4800 * e / 146097
    }
    function rs(e) {
        return 146097 * e / 4800
    }
    function as(e) {
        if (!this.isValid())
            return NaN;
        var t, n, s = this._milliseconds;
        if ("month" === (e = F(e)) || "year" === e)
            return t = this._days + s / 864e5,
            n = this._months + is(t),
            "month" === e ? n : n / 12;
        switch (t = this._days + Math.round(rs(this._months)),
        e) {
        case "week":
            return t / 7 + s / 6048e5;
        case "day":
            return t + s / 864e5;
        case "hour":
            return 24 * t + s / 36e5;
        case "minute":
            return 1440 * t + s / 6e4;
        case "second":
            return 86400 * t + s / 1e3;
        case "millisecond":
            return Math.floor(864e5 * t) + s;
        default:
            throw new Error("Unknown unit " + e)
        }
    }
    function os() {
        return this.isValid() ? this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * p(this._months / 12) : NaN
    }
    function us(e) {
        return function() {
            return this.as(e)
        }
    }
    function ds(e) {
        return e = F(e),
        this.isValid() ? this[e + "s"]() : NaN
    }
    function ls(e) {
        return function() {
            return this.isValid() ? this._data[e] : NaN
        }
    }
    function hs() {
        return M(this.days() / 7)
    }
    function cs(e, t, n, s, i) {
        return i.relativeTime(t || 1, !!n, e, s)
    }
    function fs(e, t, n) {
        var s = At(e).abs()
          , i = Dr(s.as("s"))
          , r = Dr(s.as("m"))
          , a = Dr(s.as("h"))
          , o = Dr(s.as("d"))
          , u = Dr(s.as("M"))
          , d = Dr(s.as("y"))
          , l = i <= Yr.ss && ["s", i] || i < Yr.s && ["ss", i] || r <= 1 && ["m"] || r < Yr.m && ["mm", r] || a <= 1 && ["h"] || a < Yr.h && ["hh", a] || o <= 1 && ["d"] || o < Yr.d && ["dd", o] || u <= 1 && ["M"] || u < Yr.M && ["MM", u] || d <= 1 && ["y"] || ["yy", d];
        return l[2] = t,
        l[3] = +e > 0,
        l[4] = n,
        cs.apply(null, l)
    }
    function _s(e) {
        return void 0 === e ? Dr : "function" == typeof e && (Dr = e,
        !0)
    }
    function ms(e, t) {
        return void 0 !== Yr[e] && (void 0 === t ? Yr[e] : (Yr[e] = t,
        "s" === e && (Yr.ss = t - 1),
        !0))
    }
    function ys(e) {
        if (!this.isValid())
            return this.localeData().invalidDate();
        var t = this.localeData()
          , n = fs(this, !e, t);
        return e && (n = t.pastFuture(+this, n)),
        t.postformat(n)
    }
    function gs() {
        if (!this.isValid())
            return this.localeData().invalidDate();
        var e, t, n, s = kr(this._milliseconds) / 1e3, i = kr(this._days), r = kr(this._months);
        e = M(s / 60),
        t = M(e / 60),
        s %= 60,
        e %= 60,
        n = M(r / 12),
        r %= 12;
        var a = n
          , o = r
          , u = i
          , d = t
          , l = e
          , h = s
          , c = this.asSeconds();
        return c ? (c < 0 ? "-" : "") + "P" + (a ? a + "Y" : "") + (o ? o + "M" : "") + (u ? u + "D" : "") + (d || l || h ? "T" : "") + (d ? d + "H" : "") + (l ? l + "M" : "") + (h ? h + "S" : "") : "P0D"
    }
    function Ms(e, t, n, s) {
        var i = {
            m: ["eine Minute", "einer Minute"],
            h: ["eine Stunde", "einer Stunde"],
            d: ["ein Tag", "einem Tag"],
            dd: [e + " Tage", e + " Tagen"],
            M: ["ein Monat", "einem Monat"],
            MM: [e + " Monate", e + " Monaten"],
            y: ["ein Jahr", "einem Jahr"],
            yy: [e + " Jahre", e + " Jahren"]
        };
        return t ? i[n][0] : i[n][1]
    }
    function ps(e, t) {
        var n = e.split("_");
        return t % 10 == 1 && t % 100 != 11 ? n[0] : t % 10 >= 2 && t % 10 <= 4 && (t % 100 < 10 || t % 100 >= 20) ? n[1] : n[2]
    }
    function vs(e, t, n) {
        var s = {
            mm: t ? "хвилина_хвилини_хвилин" : "хвилину_хвилини_хвилин",
            hh: t ? "година_години_годин" : "годину_години_годин",
            dd: "день_дні_днів",
            MM: "місяць_місяці_місяців",
            yy: "рік_роки_років"
        };
        return "m" === n ? t ? "хвилина" : "хвилину" : "h" === n ? t ? "година" : "годину" : e + " " + ps(s[n], +e)
    }
    function ws(e, t) {
        var n = {
            nominative: "неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),
            accusative: "неділю_понеділок_вівторок_середу_четвер_п’ятницю_суботу".split("_"),
            genitive: "неділі_понеділка_вівторка_середи_четверга_п’ятниці_суботи".split("_")
        };
        return e ? n[/(\[[ВвУу]\]) ?dddd/.test(t) ? "accusative" : /\[?(?:минулої|наступної)? ?\] ?dddd/.test(t) ? "genitive" : "nominative"][e.day()] : n.nominative
    }
    function Ds(e) {
        return function() {
            return e + "о" + (11 === this.hours() ? "б" : "") + "] LT"
        }
    }
    var Ys, ks;
    ks = Array.prototype.some ? Array.prototype.some : function(e) {
        for (var t = Object(this), n = t.length >>> 0, s = 0; s < n; s++)
            if (s in t && e.call(this, t[s], s, t))
                return !0;
        return !1
    }
    ;
    var Ss = ks
      , Ts = e.momentProperties = []
      , Os = !1
      , xs = {};
    e.suppressDeprecationWarnings = !1,
    e.deprecationHandler = null;
    var Ls;
    Ls = Object.keys ? Object.keys : function(e) {
        var t, n = [];
        for (t in e)
            u(e, t) && n.push(t);
        return n
    }
    ;
    var bs, Ps = Ls, Ws = {
        sameDay: "[Today at] LT",
        nextDay: "[Tomorrow at] LT",
        nextWeek: "dddd [at] LT",
        lastDay: "[Yesterday at] LT",
        lastWeek: "[Last] dddd [at] LT",
        sameElse: "L"
    }, Hs = {
        LTS: "h:mm:ss A",
        LT: "h:mm A",
        L: "MM/DD/YYYY",
        LL: "MMMM D, YYYY",
        LLL: "MMMM D, YYYY h:mm A",
        LLLL: "dddd, MMMM D, YYYY h:mm A"
    }, Rs = /\d{1,2}/, Fs = {
        future: "in %s",
        past: "%s ago",
        s: "a few seconds",
        ss: "%d seconds",
        m: "a minute",
        mm: "%d minutes",
        h: "an hour",
        hh: "%d hours",
        d: "a day",
        dd: "%d days",
        M: "a month",
        MM: "%d months",
        y: "a year",
        yy: "%d years"
    }, Cs = {}, Us = {}, js = /(\[[^\[]*\])|(\\)?([Hh]mm(ss)?|Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Qo?|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|kk?|mm?|ss?|S{1,9}|x|X|zz?|ZZ?|.)/g, Gs = /(\[[^\[]*\])|(\\)?(LTS|LT|LL?L?L?|l{1,4})/g, Vs = {}, Ns = {}, Es = /\d/, As = /\d\d/, Is = /\d{3}/, zs = /\d{4}/, Zs = /[+-]?\d{6}/, Js = /\d\d?/, $s = /\d\d\d\d?/, qs = /\d\d\d\d\d\d?/, Bs = /\d{1,3}/, Qs = /\d{1,4}/, Xs = /[+-]?\d{1,6}/, Ks = /\d+/, ei = /[+-]?\d+/, ti = /Z|[+-]\d\d:?\d\d/gi, ni = /Z|[+-]\d\d(?::?\d\d)?/gi, si = /[+-]?\d+(\.\d{1,3})?/, ii = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, ri = {}, ai = {}, oi = 0, ui = 1, di = 2, li = 3, hi = 4, ci = 5, fi = 6, _i = 7, mi = 8;
    bs = Array.prototype.indexOf ? Array.prototype.indexOf : function(e) {
        var t;
        for (t = 0; t < this.length; ++t)
            if (this[t] === e)
                return t;
        return -1
    }
    ;
    var yi = bs;
    z("M", ["MM", 2], "Mo", function() {
        return this.month() + 1
    }),
    z("MMM", 0, 0, function(e) {
        return this.localeData().monthsShort(this, e)
    }),
    z("MMMM", 0, 0, function(e) {
        return this.localeData().months(this, e)
    }),
    R("month", "M"),
    U("month", 8),
    B("M", Js),
    B("MM", Js, As),
    B("MMM", function(e, t) {
        return t.monthsShortRegex(e)
    }),
    B("MMMM", function(e, t) {
        return t.monthsRegex(e)
    }),
    ee(["M", "MM"], function(e, t) {
        t[ui] = p(e) - 1
    }),
    ee(["MMM", "MMMM"], function(e, t, n, s) {
        var i = n._locale.monthsParse(e, s, n._strict);
        null != i ? t[ui] = i : c(n).invalidMonth = e
    });
    var gi = /D[oD]?(\[[^\[\]]*\]|\s)+MMMM?/
      , Mi = "January_February_March_April_May_June_July_August_September_October_November_December".split("_")
      , pi = "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_")
      , vi = ii
      , wi = ii;
    z("Y", 0, 0, function() {
        var e = this.year();
        return e <= 9999 ? "" + e : "+" + e
    }),
    z(0, ["YY", 2], 0, function() {
        return this.year() % 100
    }),
    z(0, ["YYYY", 4], 0, "year"),
    z(0, ["YYYYY", 5], 0, "year"),
    z(0, ["YYYYYY", 6, !0], 0, "year"),
    R("year", "y"),
    U("year", 1),
    B("Y", ei),
    B("YY", Js, As),
    B("YYYY", Qs, zs),
    B("YYYYY", Xs, Zs),
    B("YYYYYY", Xs, Zs),
    ee(["YYYYY", "YYYYYY"], oi),
    ee("YYYY", function(t, n) {
        n[oi] = 2 === t.length ? e.parseTwoDigitYear(t) : p(t)
    }),
    ee("YY", function(t, n) {
        n[oi] = e.parseTwoDigitYear(t)
    }),
    ee("Y", function(e, t) {
        t[oi] = parseInt(e, 10)
    }),
    e.parseTwoDigitYear = function(e) {
        return p(e) + (p(e) > 68 ? 1900 : 2e3)
    }
    ;
    var Di = G("FullYear", !0);
    z("w", ["ww", 2], "wo", "week"),
    z("W", ["WW", 2], "Wo", "isoWeek"),
    R("week", "w"),
    R("isoWeek", "W"),
    U("week", 5),
    U("isoWeek", 5),
    B("w", Js),
    B("ww", Js, As),
    B("W", Js),
    B("WW", Js, As),
    te(["w", "ww", "W", "WW"], function(e, t, n, s) {
        t[s.substr(0, 1)] = p(e)
    });
    var Yi = {
        dow: 0,
        doy: 6
    };
    z("d", 0, "do", "day"),
    z("dd", 0, 0, function(e) {
        return this.localeData().weekdaysMin(this, e)
    }),
    z("ddd", 0, 0, function(e) {
        return this.localeData().weekdaysShort(this, e)
    }),
    z("dddd", 0, 0, function(e) {
        return this.localeData().weekdays(this, e)
    }),
    z("e", 0, 0, "weekday"),
    z("E", 0, 0, "isoWeekday"),
    R("day", "d"),
    R("weekday", "e"),
    R("isoWeekday", "E"),
    U("day", 11),
    U("weekday", 11),
    U("isoWeekday", 11),
    B("d", Js),
    B("e", Js),
    B("E", Js),
    B("dd", function(e, t) {
        return t.weekdaysMinRegex(e)
    }),
    B("ddd", function(e, t) {
        return t.weekdaysShortRegex(e)
    }),
    B("dddd", function(e, t) {
        return t.weekdaysRegex(e)
    }),
    te(["dd", "ddd", "dddd"], function(e, t, n, s) {
        var i = n._locale.weekdaysParse(e, s, n._strict);
        null != i ? t.d = i : c(n).invalidWeekday = e
    }),
    te(["d", "e", "E"], function(e, t, n, s) {
        t[s] = p(e)
    });
    var ki = "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_")
      , Si = "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_")
      , Ti = "Su_Mo_Tu_We_Th_Fr_Sa".split("_")
      , Oi = ii
      , xi = ii
      , Li = ii;
    z("H", ["HH", 2], 0, "hour"),
    z("h", ["hh", 2], 0, Ee),
    z("k", ["kk", 2], 0, Ae),
    z("hmm", 0, 0, function() {
        return "" + Ee.apply(this) + I(this.minutes(), 2)
    }),
    z("hmmss", 0, 0, function() {
        return "" + Ee.apply(this) + I(this.minutes(), 2) + I(this.seconds(), 2)
    }),
    z("Hmm", 0, 0, function() {
        return "" + this.hours() + I(this.minutes(), 2)
    }),
    z("Hmmss", 0, 0, function() {
        return "" + this.hours() + I(this.minutes(), 2) + I(this.seconds(), 2)
    }),
    Ie("a", !0),
    Ie("A", !1),
    R("hour", "h"),
    U("hour", 13),
    B("a", ze),
    B("A", ze),
    B("H", Js),
    B("h", Js),
    B("k", Js),
    B("HH", Js, As),
    B("hh", Js, As),
    B("kk", Js, As),
    B("hmm", $s),
    B("hmmss", qs),
    B("Hmm", $s),
    B("Hmmss", qs),
    ee(["H", "HH"], li),
    ee(["k", "kk"], function(e, t, n) {
        var s = p(e);
        t[li] = 24 === s ? 0 : s
    }),
    ee(["a", "A"], function(e, t, n) {
        n._isPm = n._locale.isPM(e),
        n._meridiem = e
    }),
    ee(["h", "hh"], function(e, t, n) {
        t[li] = p(e),
        c(n).bigHour = !0
    }),
    ee("hmm", function(e, t, n) {
        var s = e.length - 2;
        t[li] = p(e.substr(0, s)),
        t[hi] = p(e.substr(s)),
        c(n).bigHour = !0
    }),
    ee("hmmss", function(e, t, n) {
        var s = e.length - 4
          , i = e.length - 2;
        t[li] = p(e.substr(0, s)),
        t[hi] = p(e.substr(s, 2)),
        t[ci] = p(e.substr(i)),
        c(n).bigHour = !0
    }),
    ee("Hmm", function(e, t, n) {
        var s = e.length - 2;
        t[li] = p(e.substr(0, s)),
        t[hi] = p(e.substr(s))
    }),
    ee("Hmmss", function(e, t, n) {
        var s = e.length - 4
          , i = e.length - 2;
        t[li] = p(e.substr(0, s)),
        t[hi] = p(e.substr(s, 2)),
        t[ci] = p(e.substr(i))
    });
    var bi, Pi = /[ap]\.?m?\.?/i, Wi = G("Hours", !0), Hi = {
        calendar: Ws,
        longDateFormat: Hs,
        invalidDate: "Invalid date",
        ordinal: "%d",
        dayOfMonthOrdinalParse: Rs,
        relativeTime: Fs,
        months: Mi,
        monthsShort: pi,
        week: Yi,
        weekdays: ki,
        weekdaysMin: Ti,
        weekdaysShort: Si,
        meridiemParse: Pi
    }, Ri = {}, Fi = {}, Ci = /^\s*((?:[+-]\d{6}|\d{4})-(?:\d\d-\d\d|W\d\d-\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?::\d\d(?::\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, Ui = /^\s*((?:[+-]\d{6}|\d{4})(?:\d\d\d\d|W\d\d\d|W\d\d|\d\d\d|\d\d))(?:(T| )(\d\d(?:\d\d(?:\d\d(?:[.,]\d+)?)?)?)([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, ji = /Z|[+-]\d\d(?::?\d\d)?/, Gi = [["YYYYYY-MM-DD", /[+-]\d{6}-\d\d-\d\d/], ["YYYY-MM-DD", /\d{4}-\d\d-\d\d/], ["GGGG-[W]WW-E", /\d{4}-W\d\d-\d/], ["GGGG-[W]WW", /\d{4}-W\d\d/, !1], ["YYYY-DDD", /\d{4}-\d{3}/], ["YYYY-MM", /\d{4}-\d\d/, !1], ["YYYYYYMMDD", /[+-]\d{10}/], ["YYYYMMDD", /\d{8}/], ["GGGG[W]WWE", /\d{4}W\d{3}/], ["GGGG[W]WW", /\d{4}W\d{2}/, !1], ["YYYYDDD", /\d{7}/]], Vi = [["HH:mm:ss.SSSS", /\d\d:\d\d:\d\d\.\d+/], ["HH:mm:ss,SSSS", /\d\d:\d\d:\d\d,\d+/], ["HH:mm:ss", /\d\d:\d\d:\d\d/], ["HH:mm", /\d\d:\d\d/], ["HHmmss.SSSS", /\d\d\d\d\d\d\.\d+/], ["HHmmss,SSSS", /\d\d\d\d\d\d,\d+/], ["HHmmss", /\d\d\d\d\d\d/], ["HHmm", /\d\d\d\d/], ["HH", /\d\d/]], Ni = /^\/?Date\((\-?\d+)/i, Ei = /^((?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s)?(\d?\d\s(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(?:\d\d)?\d\d\s)(\d\d:\d\d)(\:\d\d)?(\s(?:UT|GMT|[ECMP][SD]T|[A-IK-Za-ik-z]|[+-]\d{4}))$/;
    e.createFromInputFallback = D("value provided is not in a recognized RFC2822 or ISO format. moment construction falls back to js Date(), which is not reliable across all browsers and versions. Non RFC2822/ISO date formats are discouraged and will be removed in an upcoming major release. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.", function(e) {
        e._d = new Date(e._i + (e._useUTC ? " UTC" : ""))
    }),
    e.ISO_8601 = function() {}
    ,
    e.RFC_2822 = function() {}
    ;
    var Ai = D("moment().min is deprecated, use moment.max instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = Mt.apply(null, arguments);
        return this.isValid() && e.isValid() ? e < this ? this : e : _()
    })
      , Ii = D("moment().max is deprecated, use moment.min instead. http://momentjs.com/guides/#/warnings/min-max/", function() {
        var e = Mt.apply(null, arguments);
        return this.isValid() && e.isValid() ? e > this ? this : e : _()
    })
      , zi = function() {
        return Date.now ? Date.now() : +new Date
    }
      , Zi = ["year", "quarter", "month", "week", "day", "hour", "minute", "second", "millisecond"];
    xt("Z", ":"),
    xt("ZZ", ""),
    B("Z", ni),
    B("ZZ", ni),
    ee(["Z", "ZZ"], function(e, t, n) {
        n._useUTC = !0,
        n._tzm = Lt(ni, e)
    });
    var Ji = /([\+\-]|\d\d)/gi;
    e.updateOffset = function() {}
    ;
    var $i = /^(\-)?(?:(\d*)[. ])?(\d+)\:(\d+)(?:\:(\d+)(\.\d*)?)?$/
      , qi = /^(-)?P(?:(-?[0-9,.]*)Y)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)W)?(?:(-?[0-9,.]*)D)?(?:T(?:(-?[0-9,.]*)H)?(?:(-?[0-9,.]*)M)?(?:(-?[0-9,.]*)S)?)?$/;
    At.fn = St.prototype,
    At.invalid = kt;
    var Bi = Jt(1, "add")
      , Qi = Jt(-1, "subtract");
    e.defaultFormat = "YYYY-MM-DDTHH:mm:ssZ",
    e.defaultFormatUtc = "YYYY-MM-DDTHH:mm:ss[Z]";
    var Xi = D("moment().lang() is deprecated. Instead, use moment().localeData() to get the language configuration. Use moment().locale() to change languages.", function(e) {
        return void 0 === e ? this.localeData() : this.locale(e)
    });
    z(0, ["gg", 2], 0, function() {
        return this.weekYear() % 100
    }),
    z(0, ["GG", 2], 0, function() {
        return this.isoWeekYear() % 100
    }),
    Ln("gggg", "weekYear"),
    Ln("ggggg", "weekYear"),
    Ln("GGGG", "isoWeekYear"),
    Ln("GGGGG", "isoWeekYear"),
    R("weekYear", "gg"),
    R("isoWeekYear", "GG"),
    U("weekYear", 1),
    U("isoWeekYear", 1),
    B("G", ei),
    B("g", ei),
    B("GG", Js, As),
    B("gg", Js, As),
    B("GGGG", Qs, zs),
    B("gggg", Qs, zs),
    B("GGGGG", Xs, Zs),
    B("ggggg", Xs, Zs),
    te(["gggg", "ggggg", "GGGG", "GGGGG"], function(e, t, n, s) {
        t[s.substr(0, 2)] = p(e)
    }),
    te(["gg", "GG"], function(t, n, s, i) {
        n[i] = e.parseTwoDigitYear(t)
    }),
    z("Q", 0, "Qo", "quarter"),
    R("quarter", "Q"),
    U("quarter", 7),
    B("Q", Es),
    ee("Q", function(e, t) {
        t[ui] = 3 * (p(e) - 1)
    }),
    z("D", ["DD", 2], "Do", "date"),
    R("date", "D"),
    U("date", 9),
    B("D", Js),
    B("DD", Js, As),
    B("Do", function(e, t) {
        return e ? t._dayOfMonthOrdinalParse || t._ordinalParse : t._dayOfMonthOrdinalParseLenient
    }),
    ee(["D", "DD"], di),
    ee("Do", function(e, t) {
        t[di] = p(e.match(Js)[0], 10)
    });
    var Ki = G("Date", !0);
    z("DDD", ["DDDD", 3], "DDDo", "dayOfYear"),
    R("dayOfYear", "DDD"),
    U("dayOfYear", 4),
    B("DDD", Bs),
    B("DDDD", Is),
    ee(["DDD", "DDDD"], function(e, t, n) {
        n._dayOfYear = p(e)
    }),
    z("m", ["mm", 2], 0, "minute"),
    R("minute", "m"),
    U("minute", 14),
    B("m", Js),
    B("mm", Js, As),
    ee(["m", "mm"], hi);
    var er = G("Minutes", !1);
    z("s", ["ss", 2], 0, "second"),
    R("second", "s"),
    U("second", 15),
    B("s", Js),
    B("ss", Js, As),
    ee(["s", "ss"], ci);
    var tr = G("Seconds", !1);
    z("S", 0, 0, function() {
        return ~~(this.millisecond() / 100)
    }),
    z(0, ["SS", 2], 0, function() {
        return ~~(this.millisecond() / 10)
    }),
    z(0, ["SSS", 3], 0, "millisecond"),
    z(0, ["SSSS", 4], 0, function() {
        return 10 * this.millisecond()
    }),
    z(0, ["SSSSS", 5], 0, function() {
        return 100 * this.millisecond()
    }),
    z(0, ["SSSSSS", 6], 0, function() {
        return 1e3 * this.millisecond()
    }),
    z(0, ["SSSSSSS", 7], 0, function() {
        return 1e4 * this.millisecond()
    }),
    z(0, ["SSSSSSSS", 8], 0, function() {
        return 1e5 * this.millisecond()
    }),
    z(0, ["SSSSSSSSS", 9], 0, function() {
        return 1e6 * this.millisecond()
    }),
    R("millisecond", "ms"),
    U("millisecond", 16),
    B("S", Bs, Es),
    B("SS", Bs, As),
    B("SSS", Bs, Is);
    var nr;
    for (nr = "SSSS"; nr.length <= 9; nr += "S")
        B(nr, Ks);
    for (nr = "S"; nr.length <= 9; nr += "S")
        ee(nr, jn);
    var sr = G("Milliseconds", !1);
    z("z", 0, 0, "zoneAbbr"),
    z("zz", 0, 0, "zoneName");
    var ir = y.prototype;
    ir.add = Bi,
    ir.calendar = Bt,
    ir.clone = Qt,
    ir.diff = rn,
    ir.endOf = Mn,
    ir.format = ln,
    ir.from = hn,
    ir.fromNow = cn,
    ir.to = fn,
    ir.toNow = _n,
    ir.get = E,
    ir.invalidAt = On,
    ir.isAfter = Xt,
    ir.isBefore = Kt,
    ir.isBetween = en,
    ir.isSame = tn,
    ir.isSameOrAfter = nn,
    ir.isSameOrBefore = sn,
    ir.isValid = Sn,
    ir.lang = Xi,
    ir.locale = mn,
    ir.localeData = yn,
    ir.max = Ii,
    ir.min = Ai,
    ir.parsingFlags = Tn,
    ir.set = A,
    ir.startOf = gn,
    ir.subtract = Qi,
    ir.toArray = Dn,
    ir.toObject = Yn,
    ir.toDate = wn,
    ir.toISOString = un,
    ir.inspect = dn,
    ir.toJSON = kn,
    ir.toString = on,
    ir.unix = vn,
    ir.valueOf = pn,
    ir.creationData = xn,
    ir.year = Di,
    ir.isLeapYear = ye,
    ir.weekYear = bn,
    ir.isoWeekYear = Pn,
    ir.quarter = ir.quarters = Cn,
    ir.month = de,
    ir.daysInMonth = le,
    ir.week = ir.weeks = Te,
    ir.isoWeek = ir.isoWeeks = Oe,
    ir.weeksInYear = Hn,
    ir.isoWeeksInYear = Wn,
    ir.date = Ki,
    ir.day = ir.days = Fe,
    ir.weekday = Ce,
    ir.isoWeekday = Ue,
    ir.dayOfYear = Un,
    ir.hour = ir.hours = Wi,
    ir.minute = ir.minutes = er,
    ir.second = ir.seconds = tr,
    ir.millisecond = ir.milliseconds = sr,
    ir.utcOffset = Wt,
    ir.utc = Rt,
    ir.local = Ft,
    ir.parseZone = Ct,
    ir.hasAlignedHourOffset = Ut,
    ir.isDST = jt,
    ir.isLocal = Vt,
    ir.isUtcOffset = Nt,
    ir.isUtc = Et,
    ir.isUTC = Et,
    ir.zoneAbbr = Gn,
    ir.zoneName = Vn,
    ir.dates = D("dates accessor is deprecated. Use date instead.", Ki),
    ir.months = D("months accessor is deprecated. Use month instead", de),
    ir.years = D("years accessor is deprecated. Use year instead", Di),
    ir.zone = D("moment().zone is deprecated, use moment().utcOffset instead. http://momentjs.com/guides/#/warnings/zone/", Ht),
    ir.isDSTShifted = D("isDSTShifted is deprecated. See http://momentjs.com/guides/#/warnings/dst-shifted/ for more information", Gt);
    var rr = O.prototype;
    rr.calendar = x,
    rr.longDateFormat = L,
    rr.invalidDate = b,
    rr.ordinal = P,
    rr.preparse = An,
    rr.postformat = An,
    rr.relativeTime = W,
    rr.pastFuture = H,
    rr.set = S,
    rr.months = ie,
    rr.monthsShort = re,
    rr.monthsParse = oe,
    rr.monthsRegex = ce,
    rr.monthsShortRegex = he,
    rr.week = Ye,
    rr.firstDayOfYear = Se,
    rr.firstDayOfWeek = ke,
    rr.weekdays = be,
    rr.weekdaysMin = We,
    rr.weekdaysShort = Pe,
    rr.weekdaysParse = Re,
    rr.weekdaysRegex = je,
    rr.weekdaysShortRegex = Ge,
    rr.weekdaysMinRegex = Ve,
    rr.isPM = Ze,
    rr.meridiem = Je,
    Qe("en", {
        dayOfMonthOrdinalParse: /\d{1,2}(th|st|nd|rd)/,
        ordinal: function(e) {
            var t = e % 10;
            return e + (1 === p(e % 100 / 10) ? "th" : 1 === t ? "st" : 2 === t ? "nd" : 3 === t ? "rd" : "th")
        }
    }),
    e.lang = D("moment.lang is deprecated. Use moment.locale instead.", Qe),
    e.langData = D("moment.langData is deprecated. Use moment.localeData instead.", et);
    var ar = Math.abs
      , or = us("ms")
      , ur = us("s")
      , dr = us("m")
      , lr = us("h")
      , hr = us("d")
      , cr = us("w")
      , fr = us("M")
      , _r = us("y")
      , mr = ls("milliseconds")
      , yr = ls("seconds")
      , gr = ls("minutes")
      , Mr = ls("hours")
      , pr = ls("days")
      , vr = ls("months")
      , wr = ls("years")
      , Dr = Math.round
      , Yr = {
        ss: 44,
        s: 45,
        m: 45,
        h: 22,
        d: 26,
        M: 11
    }
      , kr = Math.abs
      , Sr = St.prototype;
    Sr.isValid = Yt,
    Sr.abs = Xn,
    Sr.add = es,
    Sr.subtract = ts,
    Sr.as = as,
    Sr.asMilliseconds = or,
    Sr.asSeconds = ur,
    Sr.asMinutes = dr,
    Sr.asHours = lr,
    Sr.asDays = hr,
    Sr.asWeeks = cr,
    Sr.asMonths = fr,
    Sr.asYears = _r,
    Sr.valueOf = os,
    Sr._bubble = ss,
    Sr.get = ds,
    Sr.milliseconds = mr,
    Sr.seconds = yr,
    Sr.minutes = gr,
    Sr.hours = Mr,
    Sr.days = pr,
    Sr.weeks = hs,
    Sr.months = vr,
    Sr.years = wr,
    Sr.humanize = ys,
    Sr.toISOString = gs,
    Sr.toString = gs,
    Sr.toJSON = gs,
    Sr.locale = mn,
    Sr.localeData = yn,
    Sr.toIsoString = D("toIsoString() is deprecated. Please use toISOString() instead (notice the capitals)", gs),
    Sr.lang = Xi,
    z("X", 0, 0, "unix"),
    z("x", 0, 0, "valueOf"),
    B("x", ei),
    B("X", si),
    ee("X", function(e, t, n) {
        n._d = new Date(1e3 * parseFloat(e, 10))
    }),
    ee("x", function(e, t, n) {
        n._d = new Date(p(e))
    }),
    e.version = "2.18.1",
    function(e) {
        Ys = e
    }(Mt),
    e.fn = ir,
    e.min = vt,
    e.max = wt,
    e.now = zi,
    e.utc = l,
    e.unix = Nn,
    e.months = Jn,
    e.isDate = a,
    e.locale = Qe,
    e.invalid = _,
    e.duration = At,
    e.isMoment = g,
    e.weekdays = qn,
    e.parseZone = En,
    e.localeData = et,
    e.isDuration = Tt,
    e.monthsShort = $n,
    e.weekdaysMin = Qn,
    e.defineLocale = Xe,
    e.updateLocale = Ke,
    e.locales = tt,
    e.weekdaysShort = Bn,
    e.normalizeUnits = F,
    e.relativeTimeRounding = _s,
    e.relativeTimeThreshold = ms,
    e.calendarFormat = qt,
    e.prototype = ir,
    e.defineLocale("de", {
        months: "Januar_Februar_März_April_Mai_Juni_Juli_August_September_Oktober_November_Dezember".split("_"),
        monthsShort: "Jan._Febr._Mrz._Apr._Mai_Jun._Jul._Aug._Sept._Okt._Nov._Dez.".split("_"),
        monthsParseExact: !0,
        weekdays: "Sonntag_Montag_Dienstag_Mittwoch_Donnerstag_Freitag_Samstag".split("_"),
        weekdaysShort: "So._Mo._Di._Mi._Do._Fr._Sa.".split("_"),
        weekdaysMin: "So_Mo_Di_Mi_Do_Fr_Sa".split("_"),
        weekdaysParseExact: !0,
        longDateFormat: {
            LT: "HH:mm",
            LTS: "HH:mm:ss",
            L: "DD.MM.YYYY",
            LL: "D. MMMM YYYY",
            LLL: "D. MMMM YYYY HH:mm",
            LLLL: "dddd, D. MMMM YYYY HH:mm"
        },
        calendar: {
            sameDay: "[heute um] LT [Uhr]",
            sameElse: "L",
            nextDay: "[morgen um] LT [Uhr]",
            nextWeek: "dddd [um] LT [Uhr]",
            lastDay: "[gestern um] LT [Uhr]",
            lastWeek: "[letzten] dddd [um] LT [Uhr]"
        },
        relativeTime: {
            future: "in %s",
            past: "vor %s",
            s: "ein paar Sekunden",
            m: Ms,
            mm: "%d Minuten",
            h: Ms,
            hh: "%d Stunden",
            d: Ms,
            dd: Ms,
            M: Ms,
            MM: Ms,
            y: Ms,
            yy: Ms
        },
        dayOfMonthOrdinalParse: /\d{1,2}\./,
        ordinal: "%d.",
        week: {
            dow: 1,
            doy: 4
        }
    });
    var Tr = "ene._feb._mar._abr._may._jun._jul._ago._sep._oct._nov._dic.".split("_")
      , Or = "ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic".split("_");
    return e.defineLocale("es", {
        months: "enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre".split("_"),
        monthsShort: function(e, t) {
            return e ? /-MMM-/.test(t) ? Or[e.month()] : Tr[e.month()] : Tr
        },
        monthsParseExact: !0,
        weekdays: "domingo_lunes_martes_miércoles_jueves_viernes_sábado".split("_"),
        weekdaysShort: "dom._lun._mar._mié._jue._vie._sáb.".split("_"),
        weekdaysMin: "do_lu_ma_mi_ju_vi_sá".split("_"),
        weekdaysParseExact: !0,
        longDateFormat: {
            LT: "H:mm",
            LTS: "H:mm:ss",
            L: "DD/MM/YYYY",
            LL: "D [de] MMMM [de] YYYY",
            LLL: "D [de] MMMM [de] YYYY H:mm",
            LLLL: "dddd, D [de] MMMM [de] YYYY H:mm"
        },
        calendar: {
            sameDay: function() {
                return "[hoy a la" + (1 !== this.hours() ? "s" : "") + "] LT"
            },
            nextDay: function() {
                return "[mañana a la" + (1 !== this.hours() ? "s" : "") + "] LT"
            },
            nextWeek: function() {
                return "dddd [a la" + (1 !== this.hours() ? "s" : "") + "] LT"
            },
            lastDay: function() {
                return "[ayer a la" + (1 !== this.hours() ? "s" : "") + "] LT"
            },
            lastWeek: function() {
                return "[el] dddd [pasado a la" + (1 !== this.hours() ? "s" : "") + "] LT"
            },
            sameElse: "L"
        },
        relativeTime: {
            future: "en %s",
            past: "hace %s",
            s: "unos segundos",
            m: "un minuto",
            mm: "%d minutos",
            h: "una hora",
            hh: "%d horas",
            d: "un día",
            dd: "%d días",
            M: "un mes",
            MM: "%d meses",
            y: "un año",
            yy: "%d años"
        },
        dayOfMonthOrdinalParse: /\d{1,2}º/,
        ordinal: "%dº",
        week: {
            dow: 1,
            doy: 4
        }
    }),
    e.defineLocale("fr", {
        months: "janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre".split("_"),
        monthsShort: "janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.".split("_"),
        monthsParseExact: !0,
        weekdays: "dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi".split("_"),
        weekdaysShort: "dim._lun._mar._mer._jeu._ven._sam.".split("_"),
        weekdaysMin: "Di_Lu_Ma_Me_Je_Ve_Sa".split("_"),
        weekdaysParseExact: !0,
        longDateFormat: {
            LT: "HH:mm",
            LTS: "HH:mm:ss",
            L: "DD/MM/YYYY",
            LL: "D MMMM YYYY",
            LLL: "D MMMM YYYY HH:mm",
            LLLL: "dddd D MMMM YYYY HH:mm"
        },
        calendar: {
            sameDay: "[Aujourd’hui à] LT",
            nextDay: "[Demain à] LT",
            nextWeek: "dddd [à] LT",
            lastDay: "[Hier à] LT",
            lastWeek: "dddd [dernier à] LT",
            sameElse: "L"
        },
        relativeTime: {
            future: "dans %s",
            past: "il y a %s",
            s: "quelques secondes",
            m: "une minute",
            mm: "%d minutes",
            h: "une heure",
            hh: "%d heures",
            d: "un jour",
            dd: "%d jours",
            M: "un mois",
            MM: "%d mois",
            y: "un an",
            yy: "%d ans"
        },
        dayOfMonthOrdinalParse: /\d{1,2}(er|)/,
        ordinal: function(e, t) {
            switch (t) {
            case "D":
                return e + (1 === e ? "er" : "");
            default:
            case "M":
            case "Q":
            case "DDD":
            case "d":
                return e + (1 === e ? "er" : "e");
            case "w":
            case "W":
                return e + (1 === e ? "re" : "e")
            }
        },
        week: {
            dow: 1,
            doy: 4
        }
    }),
    e.defineLocale("uk", {
        months: {
            format: "січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_"),
            standalone: "січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_")
        },
        monthsShort: "січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),
        weekdays: ws,
        weekdaysShort: "нд_пн_вт_ср_чт_пт_сб".split("_"),
        weekdaysMin: "нд_пн_вт_ср_чт_пт_сб".split("_"),
        longDateFormat: {
            LT: "HH:mm",
            LTS: "HH:mm:ss",
            L: "DD.MM.YYYY",
            LL: "D MMMM YYYY р.",
            LLL: "D MMMM YYYY р., HH:mm",
            LLLL: "dddd, D MMMM YYYY р., HH:mm"
        },
        calendar: {
            sameDay: Ds("[Сьогодні "),
            nextDay: Ds("[Завтра "),
            lastDay: Ds("[Вчора "),
            nextWeek: Ds("[У] dddd ["),
            lastWeek: function() {
                switch (this.day()) {
                case 0:
                case 3:
                case 5:
                case 6:
                    return Ds("[Минулої] dddd [").call(this);
                case 1:
                case 2:
                case 4:
                    return Ds("[Минулого] dddd [").call(this)
                }
            },
            sameElse: "L"
        },
        relativeTime: {
            future: "за %s",
            past: "%s тому",
            s: "декілька секунд",
            m: vs,
            mm: vs,
            h: "годину",
            hh: vs,
            d: "день",
            dd: vs,
            M: "місяць",
            MM: vs,
            y: "рік",
            yy: vs
        },
        meridiemParse: /ночі|ранку|дня|вечора/,
        isPM: function(e) {
            return /^(дня|вечора)$/.test(e)
        },
        meridiem: function(e, t, n) {
            return e < 4 ? "ночі" : e < 12 ? "ранку" : e < 17 ? "дня" : "вечора"
        },
        dayOfMonthOrdinalParse: /\d{1,2}-(й|го)/,
        ordinal: function(e, t) {
            switch (t) {
            case "M":
            case "d":
            case "DDD":
            case "w":
            case "W":
                return e + "-й";
            case "D":
                return e + "-го";
            default:
                return e
            }
        },
        week: {
            dow: 1,
            doy: 7
        }
    }),
    e.locale("en"),
    e
});
var PIXI = function(t) {
    "use strict";
    function e(t, e) {
        return e = {
            exports: {}
        },
        t(e, e.exports),
        e.exports
    }
    function i(t) {
        if (null === t || void 0 === t)
            throw new TypeError("Object.assign cannot be called with null or undefined");
        return Object(t)
    }
    function r(t, e, i) {
        i = i || 2;
        var r = e && e.length
          , o = r ? e[0] * i : t.length
          , a = n(t, 0, o, i, !0)
          , h = [];
        if (!a || a.next === a.prev)
            return h;
        var u, l, d, p, f, v, g;
        if (r && (a = c(t, e, a, i)),
        t.length > 80 * i) {
            u = d = t[0],
            l = p = t[1];
            for (var m = i; m < o; m += i)
                f = t[m],
                v = t[m + 1],
                f < u && (u = f),
                v < l && (l = v),
                f > d && (d = f),
                v > p && (p = v);
            g = Math.max(d - u, p - l),
            g = 0 !== g ? 1 / g : 0
        }
        return s(a, h, i, u, l, g),
        h
    }
    function n(t, e, i, r, n) {
        var o, s;
        if (n === F(t, e, i, r) > 0)
            for (o = e; o < i; o += r)
                s = M(o, t[o], t[o + 1], s);
        else
            for (o = i - r; o >= e; o -= r)
                s = M(o, t[o], t[o + 1], s);
        return s && w(s, s.next) && (D(s),
        s = s.next),
        s
    }
    function o(t, e) {
        if (!t)
            return t;
        e || (e = t);
        var i, r = t;
        do {
            if (i = !1,
            r.steiner || !w(r, r.next) && 0 !== T(r.prev, r, r.next))
                r = r.next;
            else {
                if (D(r),
                (r = e = r.prev) === r.next)
                    break;
                i = !0
            }
        } while (i || r !== e);
        return e
    }
    function s(t, e, i, r, n, c, d) {
        if (t) {
            !d && c && g(t, r, n, c);
            for (var p, f, v = t; t.prev !== t.next; )
                if (p = t.prev,
                f = t.next,
                c ? h(t, r, n, c) : a(t))
                    e.push(p.i / i),
                    e.push(t.i / i),
                    e.push(f.i / i),
                    D(t),
                    t = f.next,
                    v = f.next;
                else if ((t = f) === v) {
                    d ? 1 === d ? (t = u(o(t), e, i),
                    s(t, e, i, r, n, c, 2)) : 2 === d && l(t, e, i, r, n, c) : s(o(t), e, i, r, n, c, 1);
                    break
                }
        }
    }
    function a(t) {
        var e = t.prev
          , i = t
          , r = t.next;
        if (T(e, i, r) >= 0)
            return !1;
        for (var n = t.next.next; n !== t.prev; ) {
            if (x(e.x, e.y, i.x, i.y, r.x, r.y, n.x, n.y) && T(n.prev, n, n.next) >= 0)
                return !1;
            n = n.next
        }
        return !0
    }
    function h(t, e, i, r) {
        var n = t.prev
          , o = t
          , s = t.next;
        if (T(n, o, s) >= 0)
            return !1;
        for (var a = n.x < o.x ? n.x < s.x ? n.x : s.x : o.x < s.x ? o.x : s.x, h = n.y < o.y ? n.y < s.y ? n.y : s.y : o.y < s.y ? o.y : s.y, u = n.x > o.x ? n.x > s.x ? n.x : s.x : o.x > s.x ? o.x : s.x, l = n.y > o.y ? n.y > s.y ? n.y : s.y : o.y > s.y ? o.y : s.y, c = y(a, h, e, i, r), d = y(u, l, e, i, r), p = t.prevZ, f = t.nextZ; p && p.z >= c && f && f.z <= d; ) {
            if (p !== t.prev && p !== t.next && x(n.x, n.y, o.x, o.y, s.x, s.y, p.x, p.y) && T(p.prev, p, p.next) >= 0)
                return !1;
            if (p = p.prevZ,
            f !== t.prev && f !== t.next && x(n.x, n.y, o.x, o.y, s.x, s.y, f.x, f.y) && T(f.prev, f, f.next) >= 0)
                return !1;
            f = f.nextZ
        }
        for (; p && p.z >= c; ) {
            if (p !== t.prev && p !== t.next && x(n.x, n.y, o.x, o.y, s.x, s.y, p.x, p.y) && T(p.prev, p, p.next) >= 0)
                return !1;
            p = p.prevZ
        }
        for (; f && f.z <= d; ) {
            if (f !== t.prev && f !== t.next && x(n.x, n.y, o.x, o.y, s.x, s.y, f.x, f.y) && T(f.prev, f, f.next) >= 0)
                return !1;
            f = f.nextZ
        }
        return !0
    }
    function u(t, e, i) {
        var r = t;
        do {
            var n = r.prev
              , s = r.next.next;
            !w(n, s) && E(n, r, r.next, s) && A(n, s) && A(s, n) && (e.push(n.i / i),
            e.push(r.i / i),
            e.push(s.i / i),
            D(r),
            D(r.next),
            r = t = s),
            r = r.next
        } while (r !== t);
        return o(r)
    }
    function l(t, e, i, r, n, a) {
        var h = t;
        do {
            for (var u = h.next.next; u !== h.prev; ) {
                if (h.i !== u.i && b(h, u)) {
                    var l = C(h, u);
                    return h = o(h, h.next),
                    l = o(l, l.next),
                    s(h, e, i, r, n, a),
                    void s(l, e, i, r, n, a)
                }
                u = u.next
            }
            h = h.next
        } while (h !== t)
    }
    function c(t, e, i, r) {
        var s, a, h, u, l, c = [];
        for (s = 0,
        a = e.length; s < a; s++)
            h = e[s] * r,
            u = s < a - 1 ? e[s + 1] * r : t.length,
            l = n(t, h, u, r, !1),
            l === l.next && (l.steiner = !0),
            c.push(_(l));
        for (c.sort(d),
        s = 0; s < c.length; s++)
            p(c[s], i),
            i = o(i, i.next);
        return i
    }
    function d(t, e) {
        return t.x - e.x
    }
    function p(t, e) {
        if (e = f(t, e)) {
            var i = C(e, t);
            o(i, i.next)
        }
    }
    function f(t, e) {
        var i, r = e, n = t.x, o = t.y, s = -1 / 0;
        do {
            if (o <= r.y && o >= r.next.y && r.next.y !== r.y) {
                var a = r.x + (o - r.y) * (r.next.x - r.x) / (r.next.y - r.y);
                if (a <= n && a > s) {
                    if (s = a,
                    a === n) {
                        if (o === r.y)
                            return r;
                        if (o === r.next.y)
                            return r.next
                    }
                    i = r.x < r.next.x ? r : r.next
                }
            }
            r = r.next
        } while (r !== e);
        if (!i)
            return null;
        if (n === s)
            return i;
        var h, u = i, l = i.x, c = i.y, d = 1 / 0;
        r = i;
        do {
            n >= r.x && r.x >= l && n !== r.x && x(o < c ? n : s, o, l, c, o < c ? s : n, o, r.x, r.y) && (h = Math.abs(o - r.y) / (n - r.x),
            A(r, t) && (h < d || h === d && (r.x > i.x || r.x === i.x && v(i, r))) && (i = r,
            d = h)),
            r = r.next
        } while (r !== u);
        return i
    }
    function v(t, e) {
        return T(t.prev, t, e.prev) < 0 && T(e.next, t, t.next) < 0
    }
    function g(t, e, i, r) {
        var n = t;
        do {
            null === n.z && (n.z = y(n.x, n.y, e, i, r)),
            n.prevZ = n.prev,
            n.nextZ = n.next,
            n = n.next
        } while (n !== t);
        n.prevZ.nextZ = null,
        n.prevZ = null,
        m(n)
    }
    function m(t) {
        var e, i, r, n, o, s, a, h, u = 1;
        do {
            for (i = t,
            t = null,
            o = null,
            s = 0; i; ) {
                for (s++,
                r = i,
                a = 0,
                e = 0; e < u && (a++,
                r = r.nextZ); e++)
                    ;
                for (h = u; a > 0 || h > 0 && r; )
                    0 !== a && (0 === h || !r || i.z <= r.z) ? (n = i,
                    i = i.nextZ,
                    a--) : (n = r,
                    r = r.nextZ,
                    h--),
                    o ? o.nextZ = n : t = n,
                    n.prevZ = o,
                    o = n;
                i = r
            }
            o.nextZ = null,
            u *= 2
        } while (s > 1);
        return t
    }
    function y(t, e, i, r, n) {
        return t = 32767 * (t - i) * n,
        e = 32767 * (e - r) * n,
        t = 16711935 & (t | t << 8),
        t = 252645135 & (t | t << 4),
        t = 858993459 & (t | t << 2),
        t = 1431655765 & (t | t << 1),
        e = 16711935 & (e | e << 8),
        e = 252645135 & (e | e << 4),
        e = 858993459 & (e | e << 2),
        e = 1431655765 & (e | e << 1),
        t | e << 1
    }
    function _(t) {
        var e = t
          , i = t;
        do {
            (e.x < i.x || e.x === i.x && e.y < i.y) && (i = e),
            e = e.next
        } while (e !== t);
        return i
    }
    function x(t, e, i, r, n, o, s, a) {
        return (n - s) * (e - a) - (t - s) * (o - a) >= 0 && (t - s) * (r - a) - (i - s) * (e - a) >= 0 && (i - s) * (o - a) - (n - s) * (r - a) >= 0
    }
    function b(t, e) {
        return t.next.i !== e.i && t.prev.i !== e.i && !P(t, e) && (A(t, e) && A(e, t) && O(t, e) && (T(t.prev, t, e.prev) || T(t, e.prev, e)) || w(t, e) && T(t.prev, t, t.next) > 0 && T(e.prev, e, e.next) > 0)
    }
    function T(t, e, i) {
        return (e.y - t.y) * (i.x - e.x) - (e.x - t.x) * (i.y - e.y)
    }
    function w(t, e) {
        return t.x === e.x && t.y === e.y
    }
    function E(t, e, i, r) {
        var n = I(T(t, e, i))
          , o = I(T(t, e, r))
          , s = I(T(i, r, t))
          , a = I(T(i, r, e));
        return n !== o && s !== a || (!(0 !== n || !S(t, i, e)) || (!(0 !== o || !S(t, r, e)) || (!(0 !== s || !S(i, t, r)) || !(0 !== a || !S(i, e, r)))))
    }
    function S(t, e, i) {
        return e.x <= Math.max(t.x, i.x) && e.x >= Math.min(t.x, i.x) && e.y <= Math.max(t.y, i.y) && e.y >= Math.min(t.y, i.y)
    }
    function I(t) {
        return t > 0 ? 1 : t < 0 ? -1 : 0
    }
    function P(t, e) {
        var i = t;
        do {
            if (i.i !== t.i && i.next.i !== t.i && i.i !== e.i && i.next.i !== e.i && E(i, i.next, t, e))
                return !0;
            i = i.next
        } while (i !== t);
        return !1
    }
    function A(t, e) {
        return T(t.prev, t, t.next) < 0 ? T(t, e, t.next) >= 0 && T(t, t.prev, e) >= 0 : T(t, e, t.prev) < 0 || T(t, t.next, e) < 0
    }
    function O(t, e) {
        var i = t
          , r = !1
          , n = (t.x + e.x) / 2
          , o = (t.y + e.y) / 2;
        do {
            i.y > o != i.next.y > o && i.next.y !== i.y && n < (i.next.x - i.x) * (o - i.y) / (i.next.y - i.y) + i.x && (r = !r),
            i = i.next
        } while (i !== t);
        return r
    }
    function C(t, e) {
        var i = new R(t.i,t.x,t.y)
          , r = new R(e.i,e.x,e.y)
          , n = t.next
          , o = e.prev;
        return t.next = e,
        e.prev = t,
        i.next = n,
        n.prev = i,
        r.next = i,
        i.prev = r,
        o.next = r,
        r.prev = o,
        r
    }
    function M(t, e, i, r) {
        var n = new R(t,e,i);
        return r ? (n.next = r.next,
        n.prev = r,
        r.next.prev = n,
        r.next = n) : (n.prev = n,
        n.next = n),
        n
    }
    function D(t) {
        t.next.prev = t.prev,
        t.prev.next = t.next,
        t.prevZ && (t.prevZ.nextZ = t.nextZ),
        t.nextZ && (t.nextZ.prevZ = t.prevZ)
    }
    function R(t, e, i) {
        this.i = t,
        this.x = e,
        this.y = i,
        this.prev = null,
        this.next = null,
        this.z = null,
        this.prevZ = null,
        this.nextZ = null,
        this.steiner = !1
    }
    function F(t, e, i, r) {
        for (var n = 0, o = e, s = i - r; o < i; o += r)
            n += (t[s] - t[o]) * (t[o + 1] + t[s + 1]),
            s = o;
        return n
    }
    function L(t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
    }
    function N() {
        this.protocol = null,
        this.slashes = null,
        this.auth = null,
        this.host = null,
        this.port = null,
        this.hostname = null,
        this.hash = null,
        this.search = null,
        this.query = null,
        this.pathname = null,
        this.path = null,
        this.href = null
    }
    function B(t, e, i) {
        if (t && Me.isObject(t) && t instanceof N)
            return t;
        var r = new N;
        return r.parse(t, e, i),
        r
    }
    function U(t) {
        return Me.isString(t) && (t = B(t)),
        t instanceof N ? t.format() : N.prototype.format.call(t)
    }
    function k(t, e) {
        return B(t, !1, !0).resolve(e)
    }
    function X(t, e) {
        return t ? B(t, !1, !0).resolveObject(e) : e
    }
    function j() {
        fi = !0
    }
    function G(t) {
        if (!fi) {
            if (navigator.userAgent.toLowerCase().indexOf("chrome") > -1) {
                var e = ["\n %c %c %c PixiJS " + vi + " - ✰ " + t + " ✰  %c  %c  http://www.pixijs.com/  %c %c ♥%c♥%c♥ \n\n", "background: #ff66a5; padding:5px 0;", "background: #ff66a5; padding:5px 0;", "color: #ff66a5; background: #030307; padding:5px 0;", "background: #ff66a5; padding:5px 0;", "background: #ffc3dc; padding:5px 0;", "background: #ff66a5; padding:5px 0;", "color: #ff2424; background: #fff; padding:5px 0;", "color: #ff2424; background: #fff; padding:5px 0;", "color: #ff2424; background: #fff; padding:5px 0;"];
                window.console.log.apply(console, e)
            } else
                window.console && window.console.log("PixiJS " + vi + " - " + t + " - http://www.pixijs.com/");
            fi = !0
        }
    }
    function H() {
        return void 0 === pi && (pi = function() {
            var t = {
                stencil: !0,
                failIfMajorPerformanceCaveat: Ie.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT
            };
            try {
                if (!window.WebGLRenderingContext)
                    return !1;
                var e = document.createElement("canvas")
                  , i = e.getContext("webgl", t) || e.getContext("experimental-webgl", t)
                  , r = !(!i || !i.getContextAttributes().stencil);
                if (i) {
                    var n = i.getExtension("WEBGL_lose_context");
                    n && n.loseContext()
                }
                return i = null,
                r
            } catch (t) {
                return !1
            }
        }()),
        pi
    }
    function z(t, e) {
        return e = e || [],
        e[0] = (t >> 16 & 255) / 255,
        e[1] = (t >> 8 & 255) / 255,
        e[2] = (255 & t) / 255,
        e
    }
    function V(t) {
        return t = t.toString(16),
        "#" + (t = "000000".substr(0, 6 - t.length) + t)
    }
    function Y(t) {
        return "string" == typeof t && "#" === t[0] && (t = t.substr(1)),
        parseInt(t, 16)
    }
    function W(t) {
        return (255 * t[0] << 16) + (255 * t[1] << 8) + (255 * t[2] | 0)
    }
    function q(t, e) {
        return gi[e ? 1 : 0][t]
    }
    function Z(t, e, i, r) {
        return i = i || new Float32Array(4),
        r || void 0 === r ? (i[0] = t[0] * e,
        i[1] = t[1] * e,
        i[2] = t[2] * e) : (i[0] = t[0],
        i[1] = t[1],
        i[2] = t[2]),
        i[3] = e,
        i
    }
    function K(t, e) {
        if (1 === e)
            return (255 * e << 24) + t;
        if (0 === e)
            return 0;
        var i = t >> 16 & 255
          , r = t >> 8 & 255
          , n = 255 & t;
        return i = i * e + .5 | 0,
        r = r * e + .5 | 0,
        n = n * e + .5 | 0,
        (255 * e << 24) + (i << 16) + (r << 8) + n
    }
    function J(t, e, i, r) {
        return i = i || new Float32Array(4),
        i[0] = (t >> 16 & 255) / 255,
        i[1] = (t >> 8 & 255) / 255,
        i[2] = (255 & t) / 255,
        (r || void 0 === r) && (i[0] *= e,
        i[1] *= e,
        i[2] *= e),
        i[3] = e,
        i
    }
    function Q(t, e) {
        void 0 === e && (e = null);
        var i = 6 * t;
        if (e = e || new Uint16Array(i),
        e.length !== i)
            throw new Error("Out buffer length is incorrect, got " + e.length + " and expected " + i);
        for (var r = 0, n = 0; r < i; r += 6,
        n += 4)
            e[r + 0] = n + 0,
            e[r + 1] = n + 1,
            e[r + 2] = n + 2,
            e[r + 3] = n + 0,
            e[r + 4] = n + 2,
            e[r + 5] = n + 3;
        return e
    }
    function $(t, e, i) {
        var r, n = t.length;
        if (!(e >= n || 0 === i)) {
            i = e + i > n ? n - e : i;
            var o = n - i;
            for (r = e; r < o; ++r)
                t[r] = t[r + i];
            t.length = o
        }
    }
    function tt() {
        return ++mi
    }
    function et(t) {
        return 0 === t ? 0 : t < 0 ? -1 : 1
    }
    function it(t) {
        return t += 0 === t,
        --t,
        t |= t >>> 1,
        t |= t >>> 2,
        t |= t >>> 4,
        t |= t >>> 8,
        (t |= t >>> 16) + 1
    }
    function rt(t) {
        return !(t & t - 1 || !t)
    }
    function nt(t) {
        var e = (t > 65535) << 4;
        t >>>= e;
        var i = (t > 255) << 3;
        return t >>>= i,
        e |= i,
        i = (t > 15) << 2,
        t >>>= i,
        e |= i,
        i = (t > 3) << 1,
        t >>>= i,
        (e |= i) | t >> 1
    }
    function ot() {
        var t;
        for (t in _i)
            _i[t].destroy();
        for (t in xi)
            xi[t].destroy()
    }
    function st() {
        var t;
        for (t in _i)
            delete _i[t];
        for (t in xi)
            delete xi[t]
    }
    function at(t) {
        var e, i, r, n = t.width, o = t.height, s = t.getContext("2d"), a = s.getImageData(0, 0, n, o), h = a.data, u = h.length, l = {
            top: null,
            left: null,
            right: null,
            bottom: null
        }, c = null;
        for (e = 0; e < u; e += 4)
            0 !== h[e + 3] && (i = e / 4 % n,
            r = ~~(e / 4 / n),
            null === l.top && (l.top = r),
            null === l.left ? l.left = i : i < l.left && (l.left = i),
            null === l.right ? l.right = i + 1 : l.right < i && (l.right = i + 1),
            null === l.bottom ? l.bottom = r : l.bottom < r && (l.bottom = r));
        return null !== l.top && (n = l.right - l.left,
        o = l.bottom - l.top + 1,
        c = s.getImageData(l.left, l.top, n, o)),
        {
            height: o,
            width: n,
            data: c
        }
    }
    function ht(t) {
        var e = Ei.exec(t);
        if (e)
            return {
                mediaType: e[1] ? e[1].toLowerCase() : void 0,
                subType: e[2] ? e[2].toLowerCase() : void 0,
                charset: e[3] ? e[3].toLowerCase() : void 0,
                encoding: e[4] ? e[4].toLowerCase() : void 0,
                data: e[5]
            }
    }
    function ut(t, e) {
        if (void 0 === e && (e = window.location),
        0 === t.indexOf("data:"))
            return "";
        e = e || window.location,
        wi || (wi = document.createElement("a")),
        wi.href = t,
        t = ti.parse(wi.href);
        var i = !t.port && "" === e.port || t.port === e.port;
        return t.hostname === e.hostname && i && t.protocol === e.protocol ? "" : "anonymous"
    }
    function lt(t, e) {
        var i = Ie.RETINA_PREFIX.exec(t);
        return i ? parseFloat(i[1]) : void 0 !== e ? e : 1
    }
    function ct(t, e, i) {
        if (void 0 === i && (i = 3),
        !Si[e]) {
            var r = (new Error).stack;
            void 0 === r ? console.warn("PixiJS Deprecation Warning: ", e + "\nDeprecated since v" + t) : (r = r.split("\n").splice(i).join("\n"),
            console.groupCollapsed ? (console.groupCollapsed("%cPixiJS Deprecation Warning: %c%s", "color:#614108;background:#fffbe6", "font-weight:normal;color:#614108;background:#fffbe6", e + "\nDeprecated since v" + t),
            console.warn(r),
            console.groupEnd()) : (console.warn("PixiJS Deprecation Warning: ", e + "\nDeprecated since v" + t),
            console.warn(r))),
            Si[e] = !0
        }
    }
    function dt(t, e) {
        return t.zIndex === e.zIndex ? t._lastSortedIndex - e._lastSortedIndex : t.zIndex - e.zIndex
    }
    function pt(t, e) {
        if (!t)
            return null;
        var i = "";
        if ("string" == typeof t) {
            var r = /\.(\w{3,4})(?:$|\?|#)/i.exec(t);
            r && (i = r[1].toLowerCase())
        }
        for (var n = mr.length - 1; n >= 0; --n) {
            var o = mr[n];
            if (o.test && o.test(t, i))
                return new o(t,e)
        }
        return new gr(t,e)
    }
    function ft(t) {
        t.destroy = function() {}
        ,
        t.on = function() {}
        ,
        t.once = function() {}
        ,
        t.emit = function() {}
    }
    function vt(t) {
        if (4 === t.BYTES_PER_ELEMENT)
            return t instanceof Float32Array ? "Float32Array" : t instanceof Uint32Array ? "Uint32Array" : "Int32Array";
        if (2 === t.BYTES_PER_ELEMENT) {
            if (t instanceof Uint16Array)
                return "Uint16Array"
        } else if (1 === t.BYTES_PER_ELEMENT && t instanceof Uint8Array)
            return "Uint8Array";
        return null
    }
    function gt(t, e) {
        for (var i = 0, r = 0, n = {}, o = 0; o < t.length; o++)
            r += e[o],
            i += t[o].length;
        for (var s = new ArrayBuffer(4 * i), a = null, h = 0, u = 0; u < t.length; u++) {
            var l = e[u]
              , c = t[u]
              , d = vt(c);
            n[d] || (n[d] = new jr[d](s)),
            a = n[d];
            for (var p = 0; p < c.length; p++) {
                a[(p / l | 0) * r + h + p % l] = c[p]
            }
            h += l
        }
        return new Float32Array(s)
    }
    function mt(t, e, i, r) {
        var n = yt(t, t.VERTEX_SHADER, e)
          , o = yt(t, t.FRAGMENT_SHADER, i)
          , s = t.createProgram();
        if (t.attachShader(s, n),
        t.attachShader(s, o),
        r)
            for (var a in r)
                t.bindAttribLocation(s, r[a], a);
        return t.linkProgram(s),
        t.getProgramParameter(s, t.LINK_STATUS) || (console.error("Pixi.js Error: Could not initialize shader."),
        console.error("gl.VALIDATE_STATUS", t.getProgramParameter(s, t.VALIDATE_STATUS)),
        console.error("gl.getError()", t.getError()),
        "" !== t.getProgramInfoLog(s) && console.warn("Pixi.js Warning: gl.getProgramInfoLog()", t.getProgramInfoLog(s)),
        t.deleteProgram(s),
        s = null),
        t.deleteShader(n),
        t.deleteShader(o),
        s
    }
    function yt(t, e, i) {
        var r = t.createShader(e);
        return t.shaderSource(r, i),
        t.compileShader(r),
        t.getShaderParameter(r, t.COMPILE_STATUS) ? r : (console.warn(i),
        console.error(t.getShaderInfoLog(r)),
        null)
    }
    function _t(t, e) {
        switch (t) {
        case "float":
            return 0;
        case "vec2":
            return new Float32Array(2 * e);
        case "vec3":
            return new Float32Array(3 * e);
        case "vec4":
            return new Float32Array(4 * e);
        case "int":
        case "sampler2D":
        case "sampler2DArray":
            return 0;
        case "ivec2":
            return new Int32Array(2 * e);
        case "ivec3":
            return new Int32Array(3 * e);
        case "ivec4":
            return new Int32Array(4 * e);
        case "bool":
            return !1;
        case "bvec2":
            return xt(2 * e);
        case "bvec3":
            return xt(3 * e);
        case "bvec4":
            return xt(4 * e);
        case "mat2":
            return new Float32Array([1, 0, 0, 1]);
        case "mat3":
            return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);
        case "mat4":
            return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1])
        }
        return null
    }
    function xt(t) {
        for (var e = new Array(t), i = 0; i < e.length; i++)
            e[i] = !1;
        return e
    }
    function bt() {
        if (ln === un || ln.isContextLost()) {
            var t, e = document.createElement("canvas");
            Ie.PREFER_ENV >= ei.WEBGL2 && (t = e.getContext("webgl2", {})),
            t || (t = e.getContext("webgl", {}) || e.getContext("experimental-webgl", {}),
            t ? t.getExtension("WEBGL_draw_buffers") : t = null),
            ln = t
        }
        return ln
    }
    function Tt() {
        if (!tn) {
            tn = di.MEDIUM;
            var t = bt();
            if (t && t.getShaderPrecisionFormat) {
                var e = t.getShaderPrecisionFormat(t.FRAGMENT_SHADER, t.HIGH_FLOAT);
                tn = e.precision ? di.HIGH : di.MEDIUM
            }
        }
        return tn
    }
    function wt(t, e, i) {
        if ("precision" !== t.substring(0, 9)) {
            var r = e;
            return e === di.HIGH && i !== di.HIGH && (r = di.MEDIUM),
            "precision " + r + " float;\n" + t
        }
        return i !== di.HIGH && "precision highp" === t.substring(0, 15) ? t.replace("precision highp", "precision mediump") : t
    }
    function Et(t) {
        return cn[t]
    }
    function St(t, e) {
        if (!dn) {
            var i = Object.keys(pn);
            dn = {};
            for (var r = 0; r < i.length; ++r) {
                var n = i[r];
                dn[t[n]] = pn[n]
            }
        }
        return dn[e]
    }
    function It(t, e) {
        var i = 0
          , r = "var v = null;\n    var cv = null\n    var gl = renderer.gl";
        for (var n in t.uniforms) {
            var o = e[n];
            if (o)
                if ("float" === o.type && 1 === o.size)
                    r += "\n            if(uv." + n + " !== ud." + n + ".value)\n            {\n                ud." + n + ".value = uv." + n + "\n                gl.uniform1f(ud." + n + ".location, uv." + n + ")\n            }\n";
                else if ("sampler2D" !== o.type && "samplerCube" !== o.type && "sampler2DArray" !== o.type || 1 !== o.size || o.isArray)
                    if ("mat3" === o.type && 1 === o.size)
                        void 0 !== t.uniforms[n].a ? r += "\n                gl.uniformMatrix3fv(ud." + n + ".location, false, uv." + n + ".toArray(true));\n                \n" : r += "\n                gl.uniformMatrix3fv(ud." + n + ".location, false, uv." + n + ");\n                \n";
                    else if ("vec2" === o.type && 1 === o.size)
                        void 0 !== t.uniforms[n].x ? r += "\n                cv = ud." + n + ".value;\n                v = uv." + n + ";\n\n                if(cv[0] !== v.x || cv[1] !== v.y)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    gl.uniform2f(ud." + n + ".location, v.x, v.y);\n                }\n" : r += "\n                cv = ud." + n + ".value;\n                v = uv." + n + ";\n\n                if(cv[0] !== v[0] || cv[1] !== v[1])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    gl.uniform2f(ud." + n + ".location, v[0], v[1]);\n                }\n                \n";
                    else if ("vec4" === o.type && 1 === o.size)
                        void 0 !== t.uniforms[n].width ? r += "\n                cv = ud." + n + ".value;\n                v = uv." + n + ";\n\n                if(cv[0] !== v.x || cv[1] !== v.y || cv[2] !== v.width || cv[3] !== v.height)\n                {\n                    cv[0] = v.x;\n                    cv[1] = v.y;\n                    cv[2] = v.width;\n                    cv[3] = v.height;\n                    gl.uniform4f(ud." + n + ".location, v.x, v.y, v.width, v.height)\n                }\n" : r += "\n                cv = ud." + n + ".value;\n                v = uv." + n + ";\n\n                if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2] || cv[3] !== v[3])\n                {\n                    cv[0] = v[0];\n                    cv[1] = v[1];\n                    cv[2] = v[2];\n                    cv[3] = v[3];\n\n                    gl.uniform4f(ud." + n + ".location, v[0], v[1], v[2], v[3])\n                }\n                \n";
                    else {
                        var s = 1 === o.size ? fn : vn
                          , a = s[o.type].replace("location", "ud." + n + ".location");
                        r += "\n            cv = ud." + n + ".value;\n            v = uv." + n + ";\n            " + a + ";\n"
                    }
                else
                    r += "\n            renderer.texture.bind(uv." + n + ", " + i + ");\n\n            if(ud." + n + ".value !== " + i + ")\n            {\n                ud." + n + ".value = " + i + ";\n                gl.uniform1i(ud." + n + ".location, " + i + ");\n; // eslint-disable-line max-len\n            }\n",
                    i++;
            else
                t.uniforms[n].group && (r += "\n                    renderer.shader.syncUniformGroup(uv." + n + ");\n                ")
        }
        return new Function("ud","uv","renderer",r)
    }
    function Pt(t, e) {
        if (0 === t)
            throw new Error("Invalid value of `0` passed to `checkMaxIfStatementsInShader`");
        for (var i = e.createShader(e.FRAGMENT_SHADER); ; ) {
            var r = gn.replace(/%forloop%/gi, At(t));
            if (e.shaderSource(i, r),
            e.compileShader(i),
            e.getShaderParameter(i, e.COMPILE_STATUS))
                break;
            t = t / 2 | 0
        }
        return t
    }
    function At(t) {
        for (var e = "", i = 0; i < t; ++i)
            i > 0 && (e += "\nelse "),
            i < t - 1 && (e += "if(test == " + i + ".0){}");
        return e
    }
    function Ot() {
        if ("boolean" == typeof en)
            return en;
        try {
            var t = new Function("param1","param2","param3","return param1[param2] === param3;");
            en = !0 === t({
                a: "b"
            }, "a", "b")
        } catch (t) {
            en = !1
        }
        return en
    }
    function Ct(t, e) {
        return void 0 === e && (e = []),
        e[ri.NORMAL] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.ADD] = [t.ONE, t.ONE],
        e[ri.MULTIPLY] = [t.DST_COLOR, t.ONE_MINUS_SRC_ALPHA, t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.SCREEN] = [t.ONE, t.ONE_MINUS_SRC_COLOR, t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.OVERLAY] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.DARKEN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.LIGHTEN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.COLOR_DODGE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.COLOR_BURN] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.HARD_LIGHT] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.SOFT_LIGHT] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.DIFFERENCE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.EXCLUSION] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.HUE] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.SATURATION] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.COLOR] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.LUMINOSITY] = [t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.NONE] = [0, 0],
        e[ri.NORMAL_NPM] = [t.SRC_ALPHA, t.ONE_MINUS_SRC_ALPHA, t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.ADD_NPM] = [t.SRC_ALPHA, t.ONE, t.ONE, t.ONE],
        e[ri.SCREEN_NPM] = [t.SRC_ALPHA, t.ONE_MINUS_SRC_COLOR, t.ONE, t.ONE_MINUS_SRC_ALPHA],
        e[ri.SRC_IN] = [t.DST_ALPHA, t.ZERO],
        e[ri.SRC_OUT] = [t.ONE_MINUS_DST_ALPHA, t.ZERO],
        e[ri.SRC_ATOP] = [t.DST_ALPHA, t.ONE_MINUS_SRC_ALPHA],
        e[ri.DST_OVER] = [t.ONE_MINUS_DST_ALPHA, t.ONE],
        e[ri.DST_IN] = [t.ZERO, t.SRC_ALPHA],
        e[ri.DST_OUT] = [t.ZERO, t.ONE_MINUS_SRC_ALPHA],
        e[ri.DST_ATOP] = [t.ONE_MINUS_DST_ALPHA, t.SRC_ALPHA],
        e[ri.SUBTRACT] = [t.ONE, t.ONE, t.ONE, t.ONE, t.FUNC_REVERSE_SUBTRACT, t.FUNC_ADD],
        e
    }
    function Mt(t) {
        return Qn.create(t)
    }
    function Dt(t, e) {
        t.lineStyle.native ? Ft(t, e) : Rt(t, e)
    }
    function Rt(t, e) {
        var i = t.shape
          , r = t.points || i.points.slice()
          , n = e.closePointEps;
        if (0 !== r.length) {
            var o = t.lineStyle
              , s = new Pi(r[0],r[1])
              , a = new Pi(r[r.length - 2],r[r.length - 1])
              , h = i.type !== Ri.POLY || i.closeStroke
              , u = Math.abs(s.x - a.x) < n && Math.abs(s.y - a.y) < n;
            if (h) {
                r = r.slice(),
                u && (r.pop(),
                r.pop(),
                a.set(r[r.length - 2], r[r.length - 1]));
                var l = a.x + .5 * (s.x - a.x)
                  , c = a.y + .5 * (s.y - a.y);
                r.unshift(l, c),
                r.push(l, c)
            }
            var d = e.points
              , p = r.length / 2
              , f = r.length
              , v = d.length / 2
              , g = o.width / 2
              , m = r[0]
              , y = r[1]
              , _ = r[2]
              , x = r[3]
              , b = 0
              , T = 0
              , w = -(y - x)
              , E = m - _
              , S = 0
              , I = 0
              , P = 0
              , A = 0
              , O = Math.sqrt(w * w + E * E);
            w /= O,
            E /= O,
            w *= g,
            E *= g;
            var C = o.alignment
              , M = 2 * (1 - C)
              , D = 2 * C;
            d.push(m - w * M, y - E * M),
            d.push(m + w * D, y + E * D);
            for (var R = 1; R < p - 1; ++R) {
                m = r[2 * (R - 1)],
                y = r[2 * (R - 1) + 1],
                _ = r[2 * R],
                x = r[2 * R + 1],
                b = r[2 * (R + 1)],
                T = r[2 * (R + 1) + 1],
                w = -(y - x),
                E = m - _,
                O = Math.sqrt(w * w + E * E),
                w /= O,
                E /= O,
                w *= g,
                E *= g,
                S = -(x - T),
                I = _ - b,
                O = Math.sqrt(S * S + I * I),
                S /= O,
                I /= O,
                S *= g,
                I *= g;
                var F = -E + y - (-E + x)
                  , L = -w + _ - (-w + m)
                  , N = (-w + m) * (-E + x) - (-w + _) * (-E + y)
                  , B = -I + T - (-I + x)
                  , U = -S + _ - (-S + b)
                  , k = (-S + b) * (-I + x) - (-S + _) * (-I + T)
                  , X = F * U - B * L;
                if (Math.abs(X) < .1)
                    X += 10.1,
                    d.push(_ - w * M, x - E * M),
                    d.push(_ + w * D, x + E * D);
                else {
                    var j = (L * k - U * N) / X
                      , G = (B * N - F * k) / X;
                    (j - _) * (j - _) + (G - x) * (G - x) > 196 * g * g ? (P = w - S,
                    A = E - I,
                    O = Math.sqrt(P * P + A * A),
                    P /= O,
                    A /= O,
                    P *= g,
                    A *= g,
                    d.push(_ - P * M, x - A * M),
                    d.push(_ + P * D, x + A * D),
                    d.push(_ - P * D * M, x - A * M),
                    f++) : (d.push(_ + (j - _) * M, x + (G - x) * M),
                    d.push(_ - (j - _) * D, x - (G - x) * D))
                }
            }
            m = r[2 * (p - 2)],
            y = r[2 * (p - 2) + 1],
            _ = r[2 * (p - 1)],
            x = r[2 * (p - 1) + 1],
            w = -(y - x),
            E = m - _,
            O = Math.sqrt(w * w + E * E),
            w /= O,
            E /= O,
            w *= g,
            E *= g,
            d.push(_ - w * M, x - E * M),
            d.push(_ + w * D, x + E * D);
            for (var H = e.indices, z = 0; z < f - 2; ++z)
                H.push(v, v + 1, v + 2),
                v++
        }
    }
    function Ft(t, e) {
        var i = 0
          , r = t.shape
          , n = t.points || r.points
          , o = r.type !== Ri.POLY || r.closeStroke;
        if (0 !== n.length) {
            var s = e.points
              , a = e.indices
              , h = n.length / 2
              , u = s.length / 2
              , l = u;
            for (s.push(n[0], n[1]),
            i = 1; i < h; i++)
                s.push(n[2 * i], n[2 * i + 1]),
                a.push(l, l + 1),
                l++;
            o && a.push(l, u)
        }
    }
    function Lt(t, e, i) {
        return t + (e - t) * i
    }
    function Nt(t, e, i, r, n, o, s) {
        void 0 === s && (s = []);
        for (var a = s, h = 0, u = 0, l = 0, c = 0, d = 0, p = 0, f = 0, v = 0; f <= 20; ++f)
            v = f / 20,
            h = Lt(t, i, v),
            u = Lt(e, r, v),
            l = Lt(i, n, v),
            c = Lt(r, o, v),
            d = Lt(h, l, v),
            p = Lt(u, c, v),
            a.push(d, p);
        return a
    }
    function Bt(t) {
        return "number" == typeof t ? V(t) : ("string" == typeof t && 0 === t.indexOf("0x") && (t = t.replace("0x", "#")),
        t)
    }
    function Ut(t) {
        if (Array.isArray(t)) {
            for (var e = 0; e < t.length; ++e)
                t[e] = Bt(t[e]);
            return t
        }
        return Bt(t)
    }
    function kt(t, e) {
        if (!Array.isArray(t) || !Array.isArray(e))
            return !1;
        if (t.length !== e.length)
            return !1;
        for (var i = 0; i < t.length; ++i)
            if (t[i] !== e[i])
                return !1;
        return !0
    }
    function Xt(t, e, i) {
        for (var r in i)
            Array.isArray(e[r]) ? t[r] = e[r].slice() : t[r] = e[r]
    }
    function jt(t, e) {
        var i = !1;
        if (t && t._textures && t._textures.length)
            for (var r = 0; r < t._textures.length; r++)
                if (t._textures[r]instanceof Lr) {
                    var n = t._textures[r].baseTexture;
                    -1 === e.indexOf(n) && (e.push(n),
                    i = !0)
                }
        return i
    }
    function Gt(t, e) {
        return t instanceof xr && (-1 === e.indexOf(t) && e.push(t),
        !0)
    }
    function Ht(t, e) {
        if (t._texture && t._texture instanceof Lr) {
            var i = t._texture.baseTexture;
            return -1 === e.indexOf(i) && e.push(i),
            !0
        }
        return !1
    }
    function zt(t, e) {
        return e instanceof os && (e.updateText(!0),
        !0)
    }
    function Vt(t, e) {
        if (e instanceof ts) {
            var i = e.toFontString();
            return is.measureFont(i),
            !0
        }
        return !1
    }
    function Yt(t, e) {
        if (t instanceof os) {
            -1 === e.indexOf(t.style) && e.push(t.style),
            -1 === e.indexOf(t) && e.push(t);
            var i = t._texture.baseTexture;
            return -1 === e.indexOf(i) && e.push(i),
            !0
        }
        return !1
    }
    function Wt(t, e) {
        return t instanceof ts && (-1 === e.indexOf(t) && e.push(t),
        !0)
    }
    function qt(t, e) {
        return e instanceof xr && (e._glTextures[t.CONTEXT_UID] || t.texture.bind(e),
        !0)
    }
    function Zt(t, e) {
        return e instanceof Wo && ((e.dirty || e.clearDirty || !e._webGL[t.plugins.graphics.CONTEXT_UID]) && t.plugins.graphics.updateGraphics(e),
        !0)
    }
    function Kt(t, e) {
        return t instanceof Wo && (e.push(t),
        !0)
    }
    function Jt() {}
    function Qt(t, e, i, r) {
        var n = 0
          , o = t.length;
        !function s(a) {
            if (a || n === o)
                return void (i && i(a));
            r ? setTimeout(function() {
                e(t[n++], s)
            }, 1) : e(t[n++], s)
        }()
    }
    function $t(t) {
        return function() {
            if (null === t)
                throw new Error("Callback was already called.");
            var e = t;
            t = null,
            e.apply(this, arguments)
        }
    }
    function te(t, e) {
        function i(t, e, i) {
            if (null != i && "function" != typeof i)
                throw new Error("task callback must be a function");
            if (o.started = !0,
            null == t && o.idle())
                return void setTimeout(function() {
                    return o.drain()
                }, 1);
            var r = {
                data: t,
                callback: "function" == typeof i ? i : Jt
            };
            e ? o._tasks.unshift(r) : o._tasks.push(r),
            setTimeout(function() {
                return o.process()
            }, 1)
        }
        function r(t) {
            return function() {
                n -= 1,
                t.callback.apply(t, arguments),
                null != arguments[0] && o.error(arguments[0], t.data),
                n <= o.concurrency - o.buffer && o.unsaturated(),
                o.idle() && o.drain(),
                o.process()
            }
        }
        if (null == e)
            e = 1;
        else if (0 === e)
            throw new Error("Concurrency must not be zero");
        var n = 0
          , o = {
            _tasks: [],
            concurrency: e,
            saturated: Jt,
            unsaturated: Jt,
            buffer: e / 4,
            empty: Jt,
            drain: Jt,
            error: Jt,
            started: !1,
            paused: !1,
            push: function(t, e) {
                i(t, !1, e)
            },
            kill: function() {
                n = 0,
                o.drain = Jt,
                o.started = !1,
                o._tasks = []
            },
            unshift: function(t, e) {
                i(t, !0, e)
            },
            process: function() {
                for (; !o.paused && n < o.concurrency && o._tasks.length; ) {
                    var e = o._tasks.shift();
                    0 === o._tasks.length && o.empty(),
                    n += 1,
                    n === o.concurrency && o.saturated(),
                    t(e.data, $t(r(e)))
                }
            },
            length: function() {
                return o._tasks.length
            },
            running: function() {
                return n
            },
            idle: function() {
                return o._tasks.length + n === 0
            },
            pause: function() {
                !0 !== o.paused && (o.paused = !0)
            },
            resume: function() {
                if (!1 !== o.paused) {
                    o.paused = !1;
                    for (var t = 1; t <= o.concurrency; t++)
                        o.process()
                }
            }
        };
        return o
    }
    function ee(t, e) {
        var i = this;
        ms[t.url] ? (t.data = ms[t.url],
        t.complete()) : t.onComplete.once(function() {
            return ms[i.url] = i.data
        }),
        e()
    }
    function ie(t, e) {
        for (var i = 0; i < e.length; i++) {
            var r = e[i];
            r.enumerable = r.enumerable || !1,
            r.configurable = !0,
            "value"in r && (r.writable = !0),
            Object.defineProperty(t, r.key, r)
        }
    }
    function re(t, e, i) {
        return e && ie(t.prototype, e),
        i && ie(t, i),
        t
    }
    function ne() {}
    function oe(t, e, i) {
        e && 0 === e.indexOf(".") && (e = e.substring(1)),
        e && (t[e] = i)
    }
    function se(t) {
        return t.toString().replace("object ", "")
    }
    function ae(t) {
        for (var e = "", i = 0; i < t.length; ) {
            for (var r = [0, 0, 0], n = [0, 0, 0, 0], o = 0; o < r.length; ++o)
                i < t.length ? r[o] = 255 & t.charCodeAt(i++) : r[o] = 0;
            n[0] = r[0] >> 2,
            n[1] = (3 & r[0]) << 4 | r[1] >> 4,
            n[2] = (15 & r[1]) << 2 | r[2] >> 6,
            n[3] = 63 & r[2];
            switch (i - (t.length - 1)) {
            case 2:
                n[3] = 64,
                n[2] = 64;
                break;
            case 1:
                n[3] = 64
            }
            for (var s = 0; s < n.length; ++s)
                e += bs.charAt(n[s])
        }
        return e
    }
    function he(t, e) {
        if (!t.data)
            return void e();
        if (t.xhr && t.xhrType === xs.XHR_RESPONSE_TYPE.BLOB)
            if (window.Blob && "string" != typeof t.data) {
                if (0 === t.data.type.indexOf("image")) {
                    var i = Ts.createObjectURL(t.data);
                    return t.blob = t.data,
                    t.data = new Image,
                    t.data.src = i,
                    t.type = xs.TYPE.IMAGE,
                    void (t.data.onload = function() {
                        Ts.revokeObjectURL(i),
                        t.data.onload = null,
                        e()
                    }
                    )
                }
            } else {
                var r = t.xhr.getResponseHeader("content-type");
                if (r && 0 === r.indexOf("image"))
                    return t.data = new Image,
                    t.data.src = "data:" + r + ";base64," + ae(t.xhr.responseText),
                    t.type = xs.TYPE.IMAGE,
                    void (t.data.onload = function() {
                        t.data.onload = null,
                        e()
                    }
                    )
            }
        e()
    }
    function ue(t, e) {
        var i, r = Math.ceil(t / 2), n = Zs, o = "";
        i = e ? "vBlurTexCoords[%index%] =  textureCoord + vec2(%sampleIndex% * strength, 0.0);" : "vBlurTexCoords[%index%] =  textureCoord + vec2(0.0, %sampleIndex% * strength);";
        for (var s = 0; s < t; s++) {
            var a = i.replace("%index%", s);
            a = a.replace("%sampleIndex%", s - (r - 1) + ".0"),
            o += a,
            o += "\n"
        }
        return n = n.replace("%blur%", o),
        n = n.replace("%size%", t)
    }
    function le(t) {
        for (var e, i = Ks[t], r = i.length, n = Js, o = "", s = "gl_FragColor += texture2D(uSampler, vBlurTexCoords[%index%]) * %value%;", a = 0; a < t; a++) {
            var h = s.replace("%index%", a);
            e = a,
            a >= r && (e = t - a - 1),
            h = h.replace("%value%", i[e]),
            o += h,
            o += "\n"
        }
        return n = n.replace("%blur%", o),
        n = n.replace("%size%", t)
    }
    function ce() {
        function t(t, e, i, r) {
            return ct(da, "PIXI.Sprite." + t + " method is deprecated, use PIXI.Sprite.from"),
            s.from(e, {
                resourceOptions: {
                    scale: r,
                    crossorigin: i
                }
            })
        }
        function e(t, e, i, r) {
            return ct(da, "PIXI.Texture." + t + " method is deprecated, use PIXI.Texture.from"),
            a.from(e, {
                resourceOptions: {
                    scale: r,
                    crossorigin: i
                }
            })
        }
        var i = this;
        Object.defineProperties(i, {
            SVG_SIZE: {
                get: function() {
                    return ct(da, "PIXI.utils.SVG_SIZE property has moved to PIXI.resources.SVGResource.SVG_SIZE"),
                    i.SVGResource.SVG_SIZE
                }
            },
            TransformStatic: {
                get: function() {
                    return ct(da, "PIXI.TransformStatic class has been removed, use PIXI.Transform"),
                    i.Transform
                }
            },
            TransformBase: {
                get: function() {
                    return ct(da, "PIXI.TransformBase class has been removed, use PIXI.Transform"),
                    i.Transform
                }
            },
            TRANSFORM_MODE: {
                get: function() {
                    return ct(da, "PIXI.TRANSFORM_MODE property has been removed"),
                    {
                        STATIC: 0,
                        DYNAMIC: 1
                    }
                }
            },
            WebGLRenderer: {
                get: function() {
                    return ct(da, "PIXI.WebGLRenderer class has moved to PIXI.Renderer"),
                    i.Renderer
                }
            },
            CanvasRenderTarget: {
                get: function() {
                    return ct(da, "PIXI.CanvasRenderTarget class has moved to PIXI.utils.CanvasRenderTarget"),
                    i.utils.CanvasRenderTarget
                }
            },
            loader: {
                get: function() {
                    return ct(da, "PIXI.loader instance has moved to PIXI.Loader.shared"),
                    i.Loader.shared
                }
            },
            FilterManager: {
                get: function() {
                    return ct(da, "PIXI.FilterManager class has moved to PIXI.systems.FilterSystem"),
                    i.systems.FilterSystem
                }
            }
        }),
        i.extras = {},
        Object.defineProperties(i.extras, {
            TilingSprite: {
                get: function() {
                    return ct(da, "PIXI.extras.TilingSprite class has moved to PIXI.TilingSprite"),
                    i.TilingSprite
                }
            },
            TilingSpriteRenderer: {
                get: function() {
                    return ct(da, "PIXI.extras.TilingSpriteRenderer class has moved to PIXI.TilingSpriteRenderer"),
                    i.TilingSpriteRenderer
                }
            },
            AnimatedSprite: {
                get: function() {
                    return ct(da, "PIXI.extras.AnimatedSprite class has moved to PIXI.AnimatedSprite"),
                    i.AnimatedSprite
                }
            },
            BitmapText: {
                get: function() {
                    return ct(da, "PIXI.extras.BitmapText class has moved to PIXI.BitmapText"),
                    i.BitmapText
                }
            }
        }),
        Object.defineProperties(i.utils, {
            getSvgSize: {
                get: function() {
                    return ct(da, "PIXI.utils.getSvgSize function has moved to PIXI.resources.SVGResource.getSize"),
                    i.SVGResource.getSize
                }
            }
        }),
        i.mesh = {},
        Object.defineProperties(i.mesh, {
            Mesh: {
                get: function() {
                    return ct(da, "PIXI.mesh.Mesh class has moved to PIXI.SimpleMesh"),
                    i.SimpleMesh
                }
            },
            NineSlicePlane: {
                get: function() {
                    return ct(da, "PIXI.mesh.NineSlicePlane class has moved to PIXI.NineSlicePlane"),
                    i.NineSlicePlane
                }
            },
            Plane: {
                get: function() {
                    return ct(da, "PIXI.mesh.Plane class has moved to PIXI.SimplePlane"),
                    i.SimplePlane
                }
            },
            Rope: {
                get: function() {
                    return ct(da, "PIXI.mesh.Rope class has moved to PIXI.SimpleRope"),
                    i.SimpleRope
                }
            },
            RawMesh: {
                get: function() {
                    return ct(da, "PIXI.mesh.RawMesh class has moved to PIXI.Mesh"),
                    i.Mesh
                }
            },
            CanvasMeshRenderer: {
                get: function() {
                    return ct(da, "PIXI.mesh.CanvasMeshRenderer class has moved to PIXI.CanvasMeshRenderer"),
                    i.CanvasMeshRenderer
                }
            },
            MeshRenderer: {
                get: function() {
                    return ct(da, "PIXI.mesh.MeshRenderer class has moved to PIXI.MeshRenderer"),
                    i.MeshRenderer
                }
            }
        }),
        i.particles = {},
        Object.defineProperties(i.particles, {
            ParticleContainer: {
                get: function() {
                    return ct(da, "PIXI.particles.ParticleContainer class has moved to PIXI.ParticleContainer"),
                    i.ParticleContainer
                }
            },
            ParticleRenderer: {
                get: function() {
                    return ct(da, "PIXI.particles.ParticleRenderer class has moved to PIXI.ParticleRenderer"),
                    i.ParticleRenderer
                }
            }
        }),
        i.ticker = {},
        Object.defineProperties(i.ticker, {
            Ticker: {
                get: function() {
                    return ct(da, "PIXI.ticker.Ticker class has moved to PIXI.Ticker"),
                    i.Ticker
                }
            },
            shared: {
                get: function() {
                    return ct(da, "PIXI.ticker.shared instance has moved to PIXI.Ticker.shared"),
                    i.Ticker.shared
                }
            }
        }),
        i.loaders = {},
        Object.defineProperties(i.loaders, {
            Loader: {
                get: function() {
                    return ct(da, "PIXI.loaders.Loader class has moved to PIXI.Loader"),
                    i.Loader
                }
            },
            Resource: {
                get: function() {
                    return ct(da, "PIXI.loaders.Resource class has moved to PIXI.LoaderResource"),
                    i.LoaderResource
                }
            },
            bitmapFontParser: {
                get: function() {
                    return ct(da, "PIXI.loaders.bitmapFontParser function has moved to PIXI.BitmapFontLoader.use"),
                    i.BitmapFontLoader.use
                }
            },
            parseBitmapFontData: {
                get: function() {
                    return ct(da, "PIXI.loaders.parseBitmapFontData function has moved to PIXI.BitmapFontLoader.parse"),
                    i.BitmapFontLoader.parse
                }
            },
            spritesheetParser: {
                get: function() {
                    return ct(da, "PIXI.loaders.spritesheetParser function has moved to PIXI.SpritesheetLoader.use"),
                    i.SpritesheetLoader.use
                }
            },
            getResourcePath: {
                get: function() {
                    return ct(da, "PIXI.loaders.getResourcePath property has moved to PIXI.SpritesheetLoader.getResourcePath"),
                    i.SpritesheetLoader.getResourcePath
                }
            }
        }),
        i.Loader.addPixiMiddleware = function(t) {
            return ct(da, "PIXI.loaders.Loader.addPixiMiddleware function is deprecated, use PIXI.loaders.Loader.registerPlugin"),
            i.loaders.Loader.registerPlugin({
                use: t()
            })
        }
        ,
        Object.defineProperty(i.extract, "WebGLExtract", {
            get: function() {
                return ct(da, "PIXI.extract.WebGLExtract method has moved to PIXI.extract.Extract"),
                i.extract.Extract
            }
        }),
        Object.defineProperty(i.prepare, "WebGLPrepare", {
            get: function() {
                return ct(da, "PIXI.prepare.WebGLPrepare class has moved to PIXI.prepare.Prepare"),
                i.prepare.Prepare
            }
        }),
        i.Container.prototype._renderWebGL = function(t) {
            ct(da, "PIXI.Container._renderWebGL method has moved to PIXI.Container._render"),
            this._render(t)
        }
        ,
        i.Container.prototype.renderWebGL = function(t) {
            ct(da, "PIXI.Container.renderWebGL method has moved to PIXI.Container.render"),
            this.render(t)
        }
        ,
        i.DisplayObject.prototype.renderWebGL = function(t) {
            ct(da, "PIXI.DisplayObject.renderWebGL method has moved to PIXI.DisplayObject.render"),
            this.render(t)
        }
        ,
        i.Container.prototype.renderAdvancedWebGL = function(t) {
            ct(da, "PIXI.Container.renderAdvancedWebGL method has moved to PIXI.Container.renderAdvanced"),
            this.renderAdvanced(t)
        }
        ,
        Object.defineProperties(i.settings, {
            TRANSFORM_MODE: {
                get: function() {
                    return ct(da, "PIXI.settings.TRANSFORM_MODE property has been removed"),
                    0
                },
                set: function() {
                    ct(da, "PIXI.settings.TRANSFORM_MODE property has been removed")
                }
            }
        });
        var r = i.BaseTexture;
        r.prototype.loadSource = function(t) {
            ct(da, "PIXI.BaseTexture.loadSource method has been deprecated");
            var e = i.resources.autoDetectResource(t);
            e.internal = !0,
            this.setResource(e),
            this.update()
        }
        ,
        Object.defineProperties(r.prototype, {
            hasLoaded: {
                get: function() {
                    return ct(da, "PIXI.BaseTexture.hasLoaded property has been removed, use PIXI.BaseTexture.valid"),
                    this.valid
                }
            },
            imageUrl: {
                get: function() {
                    return ct(da, "PIXI.BaseTexture.imageUrl property has been removed, use PIXI.BaseTexture.resource.url"),
                    this.resource && this.resource.url
                },
                set: function(t) {
                    ct(da, "PIXI.BaseTexture.imageUrl property has been removed, use PIXI.BaseTexture.resource.url"),
                    this.resource && (this.resource.url = t)
                }
            },
            source: {
                get: function() {
                    return ct(da, "PIXI.BaseTexture.source property has been moved, use `PIXI.BaseTexture.resource.source`"),
                    this.resource && this.resource.source
                },
                set: function(t) {
                    ct(da, "PIXI.BaseTexture.source property has been moved, use `PIXI.BaseTexture.resource.source` if you want to set HTMLCanvasElement. Otherwise, create new BaseTexture."),
                    this.resource && (this.resource.source = t)
                }
            }
        }),
        r.fromImage = function(t, e, i, n) {
            ct(da, "PIXI.BaseTexture.fromImage method has been replaced with PIXI.BaseTexture.from");
            var o = {
                scale: n,
                crossorigin: e
            };
            return r.from(t, {
                scaleMode: i,
                resourceOptions: o
            })
        }
        ,
        r.fromCanvas = function(t, e) {
            return ct(da, "PIXI.BaseTexture.fromCanvas method has been replaced with PIXI.BaseTexture.from"),
            r.from(t, {
                scaleMode: e
            })
        }
        ,
        r.fromSVG = function(t, e, i, n) {
            ct(da, "PIXI.BaseTexture.fromSVG method has been replaced with PIXI.BaseTexture.from");
            var o = {
                scale: n,
                crossorigin: e
            };
            return r.from(t, {
                scaleMode: i,
                resourceOptions: o
            })
        }
        ,
        i.Point.prototype.copy = function(t) {
            return ct(da, "PIXI.Point.copy method has been replaced with PIXI.Point.copyFrom"),
            this.copyFrom(t)
        }
        ,
        i.ObservablePoint.prototype.copy = function(t) {
            return ct(da, "PIXI.ObservablePoint.copy method has been replaced with PIXI.ObservablePoint.copyFrom"),
            this.copyFrom(t)
        }
        ,
        i.Rectangle.prototype.copy = function(t) {
            return ct(da, "PIXI.Rectangle.copy method has been replaced with PIXI.Rectangle.copyFrom"),
            this.copyFrom(t)
        }
        ,
        i.Matrix.prototype.copy = function(t) {
            return ct(da, "PIXI.Matrix.copy method has been replaced with PIXI.Matrix.copyTo"),
            this.copyTo(t)
        }
        ,
        i.systems.StateSystem.prototype.setState = function(t) {
            return ct("v5.1.0", "StateSystem.setState has been renamed to StateSystem.set"),
            this.set(t)
        }
        ,
        Object.assign(i.systems.FilterSystem.prototype, {
            getRenderTarget: function(t, e) {
                return ct(da, "PIXI.FilterManager.getRenderTarget method has been replaced with PIXI.systems.FilterSystem#getFilterTexture"),
                this.getFilterTexture(e)
            },
            returnRenderTarget: function(t) {
                ct(da, "PIXI.FilterManager.returnRenderTarget method has been replaced with PIXI.systems.FilterSystem.returnFilterTexture"),
                this.returnFilterTexture(t)
            },
            calculateScreenSpaceMatrix: function(t) {
                ct(da, "PIXI.systems.FilterSystem.calculateScreenSpaceMatrix method is removed, use `(vTextureCoord * inputSize.xy) + outputFrame.xy` instead");
                var e = t.identity()
                  , i = this.activeState
                  , r = i.sourceFrame
                  , n = i.destinationFrame;
                return e.translate(r.x / n.width, r.y / n.height),
                e.scale(n.width, n.height),
                e
            },
            calculateNormalizedScreenSpaceMatrix: function(t) {
                ct(da, "PIXI.systems.FilterManager.calculateNormalizedScreenSpaceMatrix method is removed, use `((vTextureCoord * inputSize.xy) + outputFrame.xy) / outputFrame.zw` instead.");
                var e = this.activeState
                  , i = e.sourceFrame
                  , r = e.destinationFrame
                  , n = t.identity();
                n.translate(i.x / r.width, i.y / r.height);
                var o = r.width / i.width
                  , s = r.height / i.height;
                return n.scale(o, s),
                n
            }
        }),
        Object.defineProperties(i.RenderTexture.prototype, {
            sourceFrame: {
                get: function() {
                    return ct(da, "PIXI.RenderTexture.sourceFrame property has been removed"),
                    this.filterFrame
                }
            },
            size: {
                get: function() {
                    return ct(da, "PIXI.RenderTexture.size property has been removed"),
                    this._frame
                }
            }
        });
        var n = function(t) {
            function e(e, i, r, n) {
                ct(da, "PIXI.filters.BlurXFilter class is deprecated, use PIXI.filters.BlurFilterPass"),
                t.call(this, !0, e, i, r, n)
            }
            return t && (e.__proto__ = t),
            e.prototype = Object.create(t && t.prototype),
            e.prototype.constructor = e,
            e
        }(i.filters.BlurFilterPass)
          , o = function(t) {
            function e(e, i, r, n) {
                ct(da, "PIXI.filters.BlurYFilter class is deprecated, use PIXI.filters.BlurFilterPass"),
                t.call(this, !1, e, i, r, n)
            }
            return t && (e.__proto__ = t),
            e.prototype = Object.create(t && t.prototype),
            e.prototype.constructor = e,
            e
        }(i.filters.BlurFilterPass);
        Object.assign(i.filters, {
            BlurXFilter: n,
            BlurYFilter: o
        });
        var s = i.Sprite
          , a = i.Texture
          , h = i.Graphics;
        h.prototype.generateCanvasTexture || (h.prototype.generateCanvasTexture = function() {
            ct(da, 'PIXI.Graphics.generateCanvasTexture method is only available in "pixi.js-legacy"')
        }
        ),
        Object.defineProperty(i.Graphics.prototype, "graphicsData", {
            get: function() {
                return ct(da, "PIXI.Graphics.graphicsData property is deprecated, use PIXI.Graphics.geometry.graphicsData"),
                this.geometry.graphicsData
            }
        }),
        s.fromImage = t.bind(null, "fromImage"),
        s.fromSVG = t.bind(null, "fromSVG"),
        s.fromCanvas = t.bind(null, "fromCanvas"),
        s.fromVideo = t.bind(null, "fromVideo"),
        s.fromFrame = t.bind(null, "fromFrame"),
        a.fromImage = e.bind(null, "fromImage"),
        a.fromSVG = e.bind(null, "fromSVG"),
        a.fromCanvas = e.bind(null, "fromCanvas"),
        a.fromVideo = e.bind(null, "fromVideo"),
        a.fromFrame = e.bind(null, "fromFrame"),
        Object.defineProperty(i.AbstractRenderer.prototype, "autoResize", {
            get: function() {
                return ct(da, "PIXI.AbstractRenderer.autoResize property is deprecated, use PIXI.AbstractRenderer.autoDensity"),
                this.autoDensity
            },
            set: function(t) {
                ct(da, "PIXI.AbstractRenderer.autoResize property is deprecated, use PIXI.AbstractRenderer.autoDensity"),
                this.autoDensity = t
            }
        }),
        Object.defineProperty(i.Renderer.prototype, "textureManager", {
            get: function() {
                return ct(da, "PIXI.Renderer.textureManager property is deprecated, use PIXI.Renderer.texture"),
                this.texture
            }
        }),
        i.utils.mixins = {
            mixin: function() {
                ct(da, "PIXI.utils.mixins.mixin function is no longer available")
            },
            delayMixin: function() {
                ct(da, "PIXI.utils.mixins.delayMixin function is no longer available")
            },
            performMixins: function() {
                ct(da, "PIXI.utils.mixins.performMixins function is no longer available")
            }
        }
    }
    var de = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {}
      , pe = e(function(t, e) {
        !function(t) {
            function i(t) {
                return "[object Array]" === Object.prototype.toString.call(t)
            }
            function r() {
                for (var t = 0; t < E.length; t++)
                    E[t][0](E[t][1]);
                E = [],
                m = !1
            }
            function n(t, e) {
                E.push([t, e]),
                m || (m = !0,
                w(r, 0))
            }
            function o(t, e) {
                function i(t) {
                    h(e, t)
                }
                function r(t) {
                    l(e, t)
                }
                try {
                    t(i, r)
                } catch (t) {
                    r(t)
                }
            }
            function s(t) {
                var e = t.owner
                  , i = e.state_
                  , r = e.data_
                  , n = t[i]
                  , o = t.then;
                if ("function" == typeof n) {
                    i = x;
                    try {
                        r = n(r)
                    } catch (t) {
                        l(o, t)
                    }
                }
                a(o, r) || (i === x && h(o, r),
                i === b && l(o, r))
            }
            function a(t, e) {
                var i;
                try {
                    if (t === e)
                        throw new TypeError("A promises callback cannot return that same promise.");
                    if (e && ("function" == typeof e || "object" == typeof e)) {
                        var r = e.then;
                        if ("function" == typeof r)
                            return r.call(e, function(r) {
                                i || (i = !0,
                                e !== r ? h(t, r) : u(t, r))
                            }, function(e) {
                                i || (i = !0,
                                l(t, e))
                            }),
                            !0
                    }
                } catch (e) {
                    return i || l(t, e),
                    !0
                }
                return !1
            }
            function h(t, e) {
                t !== e && a(t, e) || u(t, e)
            }
            function u(t, e) {
                t.state_ === y && (t.state_ = _,
                t.data_ = e,
                n(d, t))
            }
            function l(t, e) {
                t.state_ === y && (t.state_ = _,
                t.data_ = e,
                n(p, t))
            }
            function c(t) {
                var e = t.then_;
                t.then_ = void 0;
                for (var i = 0; i < e.length; i++)
                    s(e[i])
            }
            function d(t) {
                t.state_ = x,
                c(t)
            }
            function p(t) {
                t.state_ = b,
                c(t)
            }
            function f(t) {
                if ("function" != typeof t)
                    throw new TypeError("Promise constructor takes a function argument");
                if (this instanceof f == !1)
                    throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
                this.then_ = [],
                o(t, this)
            }
            var v = t.Promise
              , g = v && "resolve"in v && "reject"in v && "all"in v && "race"in v && function() {
                var t;
                return new v(function(e) {
                    t = e
                }
                ),
                "function" == typeof t
            }();
            e ? (e.Promise = g ? v : f,
            e.Polyfill = f) : g || (t.Promise = f);
            var m, y = "pending", _ = "sealed", x = "fulfilled", b = "rejected", T = function() {}, w = "undefined" != typeof setImmediate ? setImmediate : setTimeout, E = [];
            f.prototype = {
                constructor: f,
                state_: y,
                then_: null,
                data_: void 0,
                then: function(t, e) {
                    var i = {
                        owner: this,
                        then: new this.constructor(T),
                        fulfilled: t,
                        rejected: e
                    };
                    return this.state_ === x || this.state_ === b ? n(s, i) : this.then_.push(i),
                    i.then
                },
                catch: function(t) {
                    return this.then(null, t)
                }
            },
            f.all = function(t) {
                var e = this;
                if (!i(t))
                    throw new TypeError("You must pass an array to Promise.all().");
                return new e(function(e, i) {
                    for (var r, n = [], o = 0, s = 0; s < t.length; s++)
                        r = t[s],
                        r && "function" == typeof r.then ? r.then(function(t) {
                            return o++,
                            function(i) {
                                n[t] = i,
                                --o || e(n)
                            }
                        }(s), i) : n[s] = r;
                    o || e(n)
                }
                )
            }
            ,
            f.race = function(t) {
                var e = this;
                if (!i(t))
                    throw new TypeError("You must pass an array to Promise.race().");
                return new e(function(e, i) {
                    for (var r, n = 0; n < t.length; n++)
                        r = t[n],
                        r && "function" == typeof r.then ? r.then(e, i) : e(r)
                }
                )
            }
            ,
            f.resolve = function(t) {
                var e = this;
                return t && "object" == typeof t && t.constructor === e ? t : new e(function(e) {
                    e(t)
                }
                )
            }
            ,
            f.reject = function(t) {
                return new this(function(e, i) {
                    i(t)
                }
                )
            }
        }("undefined" != typeof window ? window : void 0 !== de ? de : "undefined" != typeof self ? self : de)
    })
      , fe = (pe.Promise,
    pe.Polyfill)
      , ve = Object.getOwnPropertySymbols
      , ge = Object.prototype.hasOwnProperty
      , me = Object.prototype.propertyIsEnumerable
      , ye = function() {
        try {
            if (!Object.assign)
                return !1;
            var t = new String("abc");
            if (t[5] = "de",
            "5" === Object.getOwnPropertyNames(t)[0])
                return !1;
            for (var e = {}, i = 0; i < 10; i++)
                e["_" + String.fromCharCode(i)] = i;
            if ("0123456789" !== Object.getOwnPropertyNames(e).map(function(t) {
                return e[t]
            }).join(""))
                return !1;
            var r = {};
            return "abcdefghijklmnopqrst".split("").forEach(function(t) {
                r[t] = t
            }),
            "abcdefghijklmnopqrst" === Object.keys(Object.assign({}, r)).join("")
        } catch (t) {
            return !1
        }
    }() ? Object.assign : function(t, e) {
        for (var r, n, o = arguments, s = i(t), a = 1; a < arguments.length; a++) {
            r = Object(o[a]);
            for (var h in r)
                ge.call(r, h) && (s[h] = r[h]);
            if (ve) {
                n = ve(r);
                for (var u = 0; u < n.length; u++)
                    me.call(r, n[u]) && (s[n[u]] = r[n[u]])
            }
        }
        return s
    }
    ;
    window.Promise || (window.Promise = fe),
    Object.assign || (Object.assign = ye);
    var _e = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};
    if (Date.now && Date.prototype.getTime || (Date.now = function() {
        return (new Date).getTime()
    }
    ),
    !_e.performance || !_e.performance.now) {
        var xe = Date.now();
        _e.performance || (_e.performance = {}),
        _e.performance.now = function() {
            return Date.now() - xe
        }
    }
    for (var be = Date.now(), Te = ["ms", "moz", "webkit", "o"], we = 0; we < Te.length && !_e.requestAnimationFrame; ++we) {
        var Ee = Te[we];
        _e.requestAnimationFrame = _e[Ee + "RequestAnimationFrame"],
        _e.cancelAnimationFrame = _e[Ee + "CancelAnimationFrame"] || _e[Ee + "CancelRequestAnimationFrame"]
    }
    _e.requestAnimationFrame || (_e.requestAnimationFrame = function(t) {
        if ("function" != typeof t)
            throw new TypeError(t + "is not a function");
        var e = Date.now()
          , i = 16 + be - e;
        return i < 0 && (i = 0),
        be = e,
        setTimeout(function() {
            be = Date.now(),
            t(performance.now())
        }, i)
    }
    ),
    _e.cancelAnimationFrame || (_e.cancelAnimationFrame = function(t) {
        return clearTimeout(t)
    }
    ),
    Math.sign || (Math.sign = function(t) {
        return t = Number(t),
        0 === t || isNaN(t) ? t : t > 0 ? 1 : -1
    }
    ),
    Number.isInteger || (Number.isInteger = function(t) {
        return "number" == typeof t && isFinite(t) && Math.floor(t) === t
    }
    ),
    window.ArrayBuffer || (window.ArrayBuffer = Array),
    window.Float32Array || (window.Float32Array = Array),
    window.Uint32Array || (window.Uint32Array = Array),
    window.Uint16Array || (window.Uint16Array = Array),
    window.Uint8Array || (window.Uint8Array = Array),
    window.Int32Array || (window.Int32Array = Array);
    var Se = e(function(t) {
        !function(e) {
            function i(t, e) {
                return t.test(e)
            }
            function r(t) {
                var e = t || ("undefined" != typeof navigator ? navigator.userAgent : "")
                  , r = e.split("[FBAN");
                void 0 !== r[1] && (e = r[0]),
                void 0 !== (r = e.split("Twitter"))[1] && (e = r[0]);
                var y = {
                    apple: {
                        phone: i(n, e) && !i(c, e),
                        ipod: i(o, e),
                        tablet: !i(n, e) && i(s, e) && !i(c, e),
                        device: (i(n, e) || i(o, e) || i(s, e)) && !i(c, e)
                    },
                    amazon: {
                        phone: i(u, e),
                        tablet: !i(u, e) && i(l, e),
                        device: i(u, e) || i(l, e)
                    },
                    android: {
                        phone: !i(c, e) && i(u, e) || !i(c, e) && i(a, e),
                        tablet: !i(c, e) && !i(u, e) && !i(a, e) && (i(l, e) || i(h, e)),
                        device: !i(c, e) && (i(u, e) || i(l, e) || i(a, e) || i(h, e)) || i(/\bokhttp\b/i, e)
                    },
                    windows: {
                        phone: i(c, e),
                        tablet: i(d, e),
                        device: i(c, e) || i(d, e)
                    },
                    other: {
                        blackberry: i(p, e),
                        blackberry10: i(f, e),
                        opera: i(v, e),
                        firefox: i(m, e),
                        chrome: i(g, e),
                        device: i(p, e) || i(f, e) || i(v, e) || i(m, e) || i(g, e)
                    }
                };
                return y.any = y.apple.device || y.android.device || y.windows.device || y.other.device,
                y.phone = y.apple.phone || y.android.phone || y.windows.phone,
                y.tablet = y.apple.tablet || y.android.tablet || y.windows.tablet,
                y
            }
            var n = /iPhone/i
              , o = /iPod/i
              , s = /iPad/i
              , a = /\bAndroid(?:.+)Mobile\b/i
              , h = /Android/i
              , u = /\bAndroid(?:.+)SD4930UR\b/i
              , l = /\bAndroid(?:.+)(?:KF[A-Z]{2,4})\b/i
              , c = /Windows Phone/i
              , d = /\bWindows(?:.+)ARM\b/i
              , p = /BlackBerry/i
              , f = /BB10/i
              , v = /Opera Mini/i
              , g = /\b(CriOS|Chrome)(?:.+)Mobile/i
              , m = /Mobile(?:.+)Firefox\b/i;
            t.exports && "undefined" == typeof window ? t.exports = r : t.exports && "undefined" != typeof window ? (t.exports = r(),
            t.exports.isMobile = r) : e.isMobile = r()
        }(de)
    })
      , Ie = (Se.isMobile,
    {
        MIPMAP_TEXTURES: 1,
        ANISOTROPIC_LEVEL: 0,
        RESOLUTION: 1,
        FILTER_RESOLUTION: 1,
        SPRITE_MAX_TEXTURES: function(t) {
            var e = !0;
            if (Se.tablet || Se.phone) {
                if (e = !1,
                Se.apple.device) {
                    var i = navigator.userAgent.match(/OS (\d+)_(\d+)?/);
                    if (i) {
                        parseInt(i[1], 10) >= 11 && (e = !0)
                    }
                }
                if (Se.android.device) {
                    var r = navigator.userAgent.match(/Android\s([0-9.]*)/);
                    if (r) {
                        parseInt(r[1], 10) >= 7 && (e = !0)
                    }
                }
            }
            return e ? t : 4
        }(32),
        SPRITE_BATCH_SIZE: 4096,
        RENDER_OPTIONS: {
            view: null,
            antialias: !1,
            forceFXAA: !1,
            autoDensity: !1,
            transparent: !1,
            backgroundColor: 0,
            clearBeforeRender: !0,
            preserveDrawingBuffer: !1,
            width: 800,
            height: 600,
            legacy: !1
        },
        GC_MODE: 0,
        GC_MAX_IDLE: 3600,
        GC_MAX_CHECK_COUNT: 600,
        WRAP_MODE: 33071,
        SCALE_MODE: 1,
        PRECISION_VERTEX: "highp",
        PRECISION_FRAGMENT: Se.apple.device ? "highp" : "mediump",
        CAN_UPLOAD_SAME_BUFFER: function() {
            return !Se.apple.device
        }(),
        CREATE_IMAGE_BITMAP: !1,
        ROUND_PIXELS: !1
    })
      , Pe = e(function(t) {
        function e() {}
        function i(t, e, i) {
            this.fn = t,
            this.context = e,
            this.once = i || !1
        }
        function r(t, e, r, n, o) {
            if ("function" != typeof r)
                throw new TypeError("The listener must be a function");
            var s = new i(r,n || t,o)
              , h = a ? a + e : e;
            return t._events[h] ? t._events[h].fn ? t._events[h] = [t._events[h], s] : t._events[h].push(s) : (t._events[h] = s,
            t._eventsCount++),
            t
        }
        function n(t, i) {
            0 == --t._eventsCount ? t._events = new e : delete t._events[i]
        }
        function o() {
            this._events = new e,
            this._eventsCount = 0
        }
        var s = Object.prototype.hasOwnProperty
          , a = "~";
        Object.create && (e.prototype = Object.create(null),
        (new e).__proto__ || (a = !1)),
        o.prototype.eventNames = function() {
            var t, e, i = [];
            if (0 === this._eventsCount)
                return i;
            for (e in t = this._events)
                s.call(t, e) && i.push(a ? e.slice(1) : e);
            return Object.getOwnPropertySymbols ? i.concat(Object.getOwnPropertySymbols(t)) : i
        }
        ,
        o.prototype.listeners = function(t) {
            var e = a ? a + t : t
              , i = this._events[e];
            if (!i)
                return [];
            if (i.fn)
                return [i.fn];
            for (var r = 0, n = i.length, o = new Array(n); r < n; r++)
                o[r] = i[r].fn;
            return o
        }
        ,
        o.prototype.listenerCount = function(t) {
            var e = a ? a + t : t
              , i = this._events[e];
            return i ? i.fn ? 1 : i.length : 0
        }
        ,
        o.prototype.emit = function(t, e, i, r, n, o) {
            var s = arguments
              , h = a ? a + t : t;
            if (!this._events[h])
                return !1;
            var u, l, c = this._events[h], d = arguments.length;
            if (c.fn) {
                switch (c.once && this.removeListener(t, c.fn, void 0, !0),
                d) {
                case 1:
                    return c.fn.call(c.context),
                    !0;
                case 2:
                    return c.fn.call(c.context, e),
                    !0;
                case 3:
                    return c.fn.call(c.context, e, i),
                    !0;
                case 4:
                    return c.fn.call(c.context, e, i, r),
                    !0;
                case 5:
                    return c.fn.call(c.context, e, i, r, n),
                    !0;
                case 6:
                    return c.fn.call(c.context, e, i, r, n, o),
                    !0
                }
                for (l = 1,
                u = new Array(d - 1); l < d; l++)
                    u[l - 1] = s[l];
                c.fn.apply(c.context, u)
            } else {
                var p, f = c.length;
                for (l = 0; l < f; l++)
                    switch (c[l].once && this.removeListener(t, c[l].fn, void 0, !0),
                    d) {
                    case 1:
                        c[l].fn.call(c[l].context);
                        break;
                    case 2:
                        c[l].fn.call(c[l].context, e);
                        break;
                    case 3:
                        c[l].fn.call(c[l].context, e, i);
                        break;
                    case 4:
                        c[l].fn.call(c[l].context, e, i, r);
                        break;
                    default:
                        if (!u)
                            for (p = 1,
                            u = new Array(d - 1); p < d; p++)
                                u[p - 1] = s[p];
                        c[l].fn.apply(c[l].context, u)
                    }
            }
            return !0
        }
        ,
        o.prototype.on = function(t, e, i) {
            return r(this, t, e, i, !1)
        }
        ,
        o.prototype.once = function(t, e, i) {
            return r(this, t, e, i, !0)
        }
        ,
        o.prototype.removeListener = function(t, e, i, r) {
            var o = a ? a + t : t;
            if (!this._events[o])
                return this;
            if (!e)
                return n(this, o),
                this;
            var s = this._events[o];
            if (s.fn)
                s.fn !== e || r && !s.once || i && s.context !== i || n(this, o);
            else {
                for (var h = 0, u = [], l = s.length; h < l; h++)
                    (s[h].fn !== e || r && !s[h].once || i && s[h].context !== i) && u.push(s[h]);
                u.length ? this._events[o] = 1 === u.length ? u[0] : u : n(this, o)
            }
            return this
        }
        ,
        o.prototype.removeAllListeners = function(t) {
            var i;
            return t ? (i = a ? a + t : t,
            this._events[i] && n(this, i)) : (this._events = new e,
            this._eventsCount = 0),
            this
        }
        ,
        o.prototype.off = o.prototype.removeListener,
        o.prototype.addListener = o.prototype.on,
        o.prefixed = a,
        o.EventEmitter = o,
        t.exports = o
    })
      , Ae = r
      , Oe = r;
    r.deviation = function(t, e, i, r) {
        var n = e && e.length
          , o = n ? e[0] * i : t.length
          , s = Math.abs(F(t, 0, o, i));
        if (n)
            for (var a = 0, h = e.length; a < h; a++) {
                var u = e[a] * i
                  , l = a < h - 1 ? e[a + 1] * i : t.length;
                s -= Math.abs(F(t, u, l, i))
            }
        var c = 0;
        for (a = 0; a < r.length; a += 3) {
            var d = r[a] * i
              , p = r[a + 1] * i
              , f = r[a + 2] * i;
            c += Math.abs((t[d] - t[f]) * (t[p + 1] - t[d + 1]) - (t[d] - t[p]) * (t[f + 1] - t[d + 1]))
        }
        return 0 === s && 0 === c ? 0 : Math.abs((c - s) / s)
    }
    ,
    r.flatten = function(t) {
        for (var e = t[0][0].length, i = {
            vertices: [],
            holes: [],
            dimensions: e
        }, r = 0, n = 0; n < t.length; n++) {
            for (var o = 0; o < t[n].length; o++)
                for (var s = 0; s < e; s++)
                    i.vertices.push(t[n][o][s]);
            n > 0 && (r += t[n - 1].length,
            i.holes.push(r))
        }
        return i
    }
    ,
    Ae.default = Oe;
    var Ce = e(function(t, e) {
        !function(i) {
            function r(t) {
                throw RangeError(D[t])
            }
            function n(t, e) {
                for (var i = t.length, r = []; i--; )
                    r[i] = e(t[i]);
                return r
            }
            function o(t, e) {
                var i = t.split("@")
                  , r = "";
                return i.length > 1 && (r = i[0] + "@",
                t = i[1]),
                t = t.replace(M, "."),
                r + n(t.split("."), e).join(".")
            }
            function s(t) {
                for (var e, i, r = [], n = 0, o = t.length; n < o; )
                    e = t.charCodeAt(n++),
                    e >= 55296 && e <= 56319 && n < o ? (i = t.charCodeAt(n++),
                    56320 == (64512 & i) ? r.push(((1023 & e) << 10) + (1023 & i) + 65536) : (r.push(e),
                    n--)) : r.push(e);
                return r
            }
            function a(t) {
                return n(t, function(t) {
                    var e = "";
                    return t > 65535 && (t -= 65536,
                    e += L(t >>> 10 & 1023 | 55296),
                    t = 56320 | 1023 & t),
                    e += L(t)
                }).join("")
            }
            function h(t) {
                return t - 48 < 10 ? t - 22 : t - 65 < 26 ? t - 65 : t - 97 < 26 ? t - 97 : b
            }
            function u(t, e) {
                return t + 22 + 75 * (t < 26) - ((0 != e) << 5)
            }
            function l(t, e, i) {
                var r = 0;
                for (t = i ? F(t / S) : t >> 1,
                t += F(t / e); t > R * w >> 1; r += b)
                    t = F(t / R);
                return F(r + (R + 1) * t / (t + E))
            }
            function c(t) {
                var e, i, n, o, s, u, c, d, p, f, v = [], g = t.length, m = 0, y = P, _ = I;
                for (i = t.lastIndexOf(A),
                i < 0 && (i = 0),
                n = 0; n < i; ++n)
                    t.charCodeAt(n) >= 128 && r("not-basic"),
                    v.push(t.charCodeAt(n));
                for (o = i > 0 ? i + 1 : 0; o < g; ) {
                    for (s = m,
                    u = 1,
                    c = b; o >= g && r("invalid-input"),
                    d = h(t.charCodeAt(o++)),
                    (d >= b || d > F((x - m) / u)) && r("overflow"),
                    m += d * u,
                    p = c <= _ ? T : c >= _ + w ? w : c - _,
                    !(d < p); c += b)
                        f = b - p,
                        u > F(x / f) && r("overflow"),
                        u *= f;
                    e = v.length + 1,
                    _ = l(m - s, e, 0 == s),
                    F(m / e) > x - y && r("overflow"),
                    y += F(m / e),
                    m %= e,
                    v.splice(m++, 0, y)
                }
                return a(v)
            }
            function d(t) {
                var e, i, n, o, a, h, c, d, p, f, v, g, m, y, _, E = [];
                for (t = s(t),
                g = t.length,
                e = P,
                i = 0,
                a = I,
                h = 0; h < g; ++h)
                    (v = t[h]) < 128 && E.push(L(v));
                for (n = o = E.length,
                o && E.push(A); n < g; ) {
                    for (c = x,
                    h = 0; h < g; ++h)
                        (v = t[h]) >= e && v < c && (c = v);
                    for (m = n + 1,
                    c - e > F((x - i) / m) && r("overflow"),
                    i += (c - e) * m,
                    e = c,
                    h = 0; h < g; ++h)
                        if (v = t[h],
                        v < e && ++i > x && r("overflow"),
                        v == e) {
                            for (d = i,
                            p = b; f = p <= a ? T : p >= a + w ? w : p - a,
                            !(d < f); p += b)
                                _ = d - f,
                                y = b - f,
                                E.push(L(u(f + _ % y, 0))),
                                d = F(_ / y);
                            E.push(L(u(d, 0))),
                            a = l(i, m, n == o),
                            i = 0,
                            ++n
                        }
                    ++i,
                    ++e
                }
                return E.join("")
            }
            function p(t) {
                return o(t, function(t) {
                    return O.test(t) ? c(t.slice(4).toLowerCase()) : t
                })
            }
            function f(t) {
                return o(t, function(t) {
                    return C.test(t) ? "xn--" + d(t) : t
                })
            }
            var v = e && !e.nodeType && e
              , g = t && !t.nodeType && t
              , m = "object" == typeof de && de;
            m.global !== m && m.window !== m && m.self !== m || (i = m);
            var y, _, x = 2147483647, b = 36, T = 1, w = 26, E = 38, S = 700, I = 72, P = 128, A = "-", O = /^xn--/, C = /[^\x20-\x7E]/, M = /[\x2E\u3002\uFF0E\uFF61]/g, D = {
                overflow: "Overflow: input needs wider integers to process",
                "not-basic": "Illegal input >= 0x80 (not a basic code point)",
                "invalid-input": "Invalid input"
            }, R = b - T, F = Math.floor, L = String.fromCharCode;
            if (y = {
                version: "1.3.2",
                ucs2: {
                    decode: s,
                    encode: a
                },
                decode: c,
                encode: d,
                toASCII: f,
                toUnicode: p
            },
            v && g)
                if (t.exports == v)
                    g.exports = y;
                else
                    for (_ in y)
                        y.hasOwnProperty(_) && (v[_] = y[_]);
            else
                i.punycode = y
        }(de)
    })
      , Me = {
        isString: function(t) {
            return "string" == typeof t
        },
        isObject: function(t) {
            return "object" == typeof t && null !== t
        },
        isNull: function(t) {
            return null === t
        },
        isNullOrUndefined: function(t) {
            return null == t
        }
    }
      , De = (Me.isString,
    Me.isObject,
    Me.isNull,
    Me.isNullOrUndefined,
    function(t, e, i, r) {
        e = e || "&",
        i = i || "=";
        var n = {};
        if ("string" != typeof t || 0 === t.length)
            return n;
        var o = /\+/g;
        t = t.split(e);
        var s = 1e3;
        r && "number" == typeof r.maxKeys && (s = r.maxKeys);
        var a = t.length;
        s > 0 && a > s && (a = s);
        for (var h = 0; h < a; ++h) {
            var u, l, c, d, p = t[h].replace(o, "%20"), f = p.indexOf(i);
            f >= 0 ? (u = p.substr(0, f),
            l = p.substr(f + 1)) : (u = p,
            l = ""),
            c = decodeURIComponent(u),
            d = decodeURIComponent(l),
            L(n, c) ? Array.isArray(n[c]) ? n[c].push(d) : n[c] = [n[c], d] : n[c] = d
        }
        return n
    }
    )
      , Re = function(t) {
        switch (typeof t) {
        case "string":
            return t;
        case "boolean":
            return t ? "true" : "false";
        case "number":
            return isFinite(t) ? t : "";
        default:
            return ""
        }
    }
      , Fe = function(t, e, i, r) {
        return e = e || "&",
        i = i || "=",
        null === t && (t = void 0),
        "object" == typeof t ? Object.keys(t).map(function(r) {
            var n = encodeURIComponent(Re(r)) + i;
            return Array.isArray(t[r]) ? t[r].map(function(t) {
                return n + encodeURIComponent(Re(t))
            }).join(e) : n + encodeURIComponent(Re(t[r]))
        }).join(e) : r ? encodeURIComponent(Re(r)) + i + encodeURIComponent(Re(t)) : ""
    }
      , Le = e(function(t, e) {
        e.decode = e.parse = De,
        e.encode = e.stringify = Fe
    })
      , Ne = (Le.decode,
    Le.parse,
    Le.encode,
    Le.stringify,
    B)
      , Be = k
      , Ue = X
      , ke = U
      , Xe = N
      , je = /^([a-z0-9.+-]+:)/i
      , Ge = /:[0-9]*$/
      , He = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/
      , ze = ["<", ">", '"', "`", " ", "\r", "\n", "\t"]
      , Ve = ["{", "}", "|", "\\", "^", "`"].concat(ze)
      , Ye = ["'"].concat(Ve)
      , We = ["%", "/", "?", ";", "#"].concat(Ye)
      , qe = ["/", "?", "#"]
      , Ze = /^[+a-z0-9A-Z_-]{0,63}$/
      , Ke = /^([+a-z0-9A-Z_-]{0,63})(.*)$/
      , Je = {
        javascript: !0,
        "javascript:": !0
    }
      , Qe = {
        javascript: !0,
        "javascript:": !0
    }
      , $e = {
        http: !0,
        https: !0,
        ftp: !0,
        gopher: !0,
        file: !0,
        "http:": !0,
        "https:": !0,
        "ftp:": !0,
        "gopher:": !0,
        "file:": !0
    };
    N.prototype.parse = function(t, e, i) {
        if (!Me.isString(t))
            throw new TypeError("Parameter 'url' must be a string, not " + typeof t);
        var r = t.indexOf("?")
          , n = -1 !== r && r < t.indexOf("#") ? "?" : "#"
          , o = t.split(n)
          , s = /\\/g;
        o[0] = o[0].replace(s, "/"),
        t = o.join(n);
        var a = t;
        if (a = a.trim(),
        !i && 1 === t.split("#").length) {
            var h = He.exec(a);
            if (h)
                return this.path = a,
                this.href = a,
                this.pathname = h[1],
                h[2] ? (this.search = h[2],
                this.query = e ? Le.parse(this.search.substr(1)) : this.search.substr(1)) : e && (this.search = "",
                this.query = {}),
                this
        }
        var u = je.exec(a);
        if (u) {
            u = u[0];
            var l = u.toLowerCase();
            this.protocol = l,
            a = a.substr(u.length)
        }
        if (i || u || a.match(/^\/\/[^@\/]+@[^@\/]+/)) {
            var c = "//" === a.substr(0, 2);
            !c || u && Qe[u] || (a = a.substr(2),
            this.slashes = !0)
        }
        if (!Qe[u] && (c || u && !$e[u])) {
            for (var d = -1, p = 0; p < qe.length; p++) {
                var f = a.indexOf(qe[p]);
                -1 !== f && (-1 === d || f < d) && (d = f)
            }
            var v, g;
            g = -1 === d ? a.lastIndexOf("@") : a.lastIndexOf("@", d),
            -1 !== g && (v = a.slice(0, g),
            a = a.slice(g + 1),
            this.auth = decodeURIComponent(v)),
            d = -1;
            for (var p = 0; p < We.length; p++) {
                var f = a.indexOf(We[p]);
                -1 !== f && (-1 === d || f < d) && (d = f)
            }
            -1 === d && (d = a.length),
            this.host = a.slice(0, d),
            a = a.slice(d),
            this.parseHost(),
            this.hostname = this.hostname || "";
            var m = "[" === this.hostname[0] && "]" === this.hostname[this.hostname.length - 1];
            if (!m)
                for (var y = this.hostname.split(/\./), p = 0, _ = y.length; p < _; p++) {
                    var x = y[p];
                    if (x && !x.match(Ze)) {
                        for (var b = "", T = 0, w = x.length; T < w; T++)
                            x.charCodeAt(T) > 127 ? b += "x" : b += x[T];
                        if (!b.match(Ze)) {
                            var E = y.slice(0, p)
                              , S = y.slice(p + 1)
                              , I = x.match(Ke);
                            I && (E.push(I[1]),
                            S.unshift(I[2])),
                            S.length && (a = "/" + S.join(".") + a),
                            this.hostname = E.join(".");
                            break
                        }
                    }
                }
            this.hostname.length > 255 ? this.hostname = "" : this.hostname = this.hostname.toLowerCase(),
            m || (this.hostname = Ce.toASCII(this.hostname));
            var P = this.port ? ":" + this.port : ""
              , A = this.hostname || "";
            this.host = A + P,
            this.href += this.host,
            m && (this.hostname = this.hostname.substr(1, this.hostname.length - 2),
            "/" !== a[0] && (a = "/" + a))
        }
        if (!Je[l])
            for (var p = 0, _ = Ye.length; p < _; p++) {
                var O = Ye[p];
                if (-1 !== a.indexOf(O)) {
                    var C = encodeURIComponent(O);
                    C === O && (C = escape(O)),
                    a = a.split(O).join(C)
                }
            }
        var M = a.indexOf("#");
        -1 !== M && (this.hash = a.substr(M),
        a = a.slice(0, M));
        var D = a.indexOf("?");
        if (-1 !== D ? (this.search = a.substr(D),
        this.query = a.substr(D + 1),
        e && (this.query = Le.parse(this.query)),
        a = a.slice(0, D)) : e && (this.search = "",
        this.query = {}),
        a && (this.pathname = a),
        $e[l] && this.hostname && !this.pathname && (this.pathname = "/"),
        this.pathname || this.search) {
            var P = this.pathname || ""
              , R = this.search || "";
            this.path = P + R
        }
        return this.href = this.format(),
        this
    }
    ,
    N.prototype.format = function() {
        var t = this.auth || "";
        t && (t = encodeURIComponent(t),
        t = t.replace(/%3A/i, ":"),
        t += "@");
        var e = this.protocol || ""
          , i = this.pathname || ""
          , r = this.hash || ""
          , n = !1
          , o = "";
        this.host ? n = t + this.host : this.hostname && (n = t + (-1 === this.hostname.indexOf(":") ? this.hostname : "[" + this.hostname + "]"),
        this.port && (n += ":" + this.port)),
        this.query && Me.isObject(this.query) && Object.keys(this.query).length && (o = Le.stringify(this.query));
        var s = this.search || o && "?" + o || "";
        return e && ":" !== e.substr(-1) && (e += ":"),
        this.slashes || (!e || $e[e]) && !1 !== n ? (n = "//" + (n || ""),
        i && "/" !== i.charAt(0) && (i = "/" + i)) : n || (n = ""),
        r && "#" !== r.charAt(0) && (r = "#" + r),
        s && "?" !== s.charAt(0) && (s = "?" + s),
        i = i.replace(/[?#]/g, function(t) {
            return encodeURIComponent(t)
        }),
        s = s.replace("#", "%23"),
        e + n + i + s + r
    }
    ,
    N.prototype.resolve = function(t) {
        return this.resolveObject(B(t, !1, !0)).format()
    }
    ,
    N.prototype.resolveObject = function(t) {
        if (Me.isString(t)) {
            var e = new N;
            e.parse(t, !1, !0),
            t = e
        }
        for (var i = new N, r = Object.keys(this), n = 0; n < r.length; n++) {
            var o = r[n];
            i[o] = this[o]
        }
        if (i.hash = t.hash,
        "" === t.href)
            return i.href = i.format(),
            i;
        if (t.slashes && !t.protocol) {
            for (var s = Object.keys(t), a = 0; a < s.length; a++) {
                var h = s[a];
                "protocol" !== h && (i[h] = t[h])
            }
            return $e[i.protocol] && i.hostname && !i.pathname && (i.path = i.pathname = "/"),
            i.href = i.format(),
            i
        }
        if (t.protocol && t.protocol !== i.protocol) {
            if (!$e[t.protocol]) {
                for (var u = Object.keys(t), l = 0; l < u.length; l++) {
                    var c = u[l];
                    i[c] = t[c]
                }
                return i.href = i.format(),
                i
            }
            if (i.protocol = t.protocol,
            t.host || Qe[t.protocol])
                i.pathname = t.pathname;
            else {
                for (var d = (t.pathname || "").split("/"); d.length && !(t.host = d.shift()); )
                    ;
                t.host || (t.host = ""),
                t.hostname || (t.hostname = ""),
                "" !== d[0] && d.unshift(""),
                d.length < 2 && d.unshift(""),
                i.pathname = d.join("/")
            }
            if (i.search = t.search,
            i.query = t.query,
            i.host = t.host || "",
            i.auth = t.auth,
            i.hostname = t.hostname || t.host,
            i.port = t.port,
            i.pathname || i.search) {
                var p = i.pathname || ""
                  , f = i.search || "";
                i.path = p + f
            }
            return i.slashes = i.slashes || t.slashes,
            i.href = i.format(),
            i
        }
        var v = i.pathname && "/" === i.pathname.charAt(0)
          , g = t.host || t.pathname && "/" === t.pathname.charAt(0)
          , m = g || v || i.host && t.pathname
          , y = m
          , _ = i.pathname && i.pathname.split("/") || []
          , d = t.pathname && t.pathname.split("/") || []
          , x = i.protocol && !$e[i.protocol];
        if (x && (i.hostname = "",
        i.port = null,
        i.host && ("" === _[0] ? _[0] = i.host : _.unshift(i.host)),
        i.host = "",
        t.protocol && (t.hostname = null,
        t.port = null,
        t.host && ("" === d[0] ? d[0] = t.host : d.unshift(t.host)),
        t.host = null),
        m = m && ("" === d[0] || "" === _[0])),
        g)
            i.host = t.host || "" === t.host ? t.host : i.host,
            i.hostname = t.hostname || "" === t.hostname ? t.hostname : i.hostname,
            i.search = t.search,
            i.query = t.query,
            _ = d;
        else if (d.length)
            _ || (_ = []),
            _.pop(),
            _ = _.concat(d),
            i.search = t.search,
            i.query = t.query;
        else if (!Me.isNullOrUndefined(t.search)) {
            if (x) {
                i.hostname = i.host = _.shift();
                var b = !!(i.host && i.host.indexOf("@") > 0) && i.host.split("@");
                b && (i.auth = b.shift(),
                i.host = i.hostname = b.shift())
            }
            return i.search = t.search,
            i.query = t.query,
            Me.isNull(i.pathname) && Me.isNull(i.search) || (i.path = (i.pathname ? i.pathname : "") + (i.search ? i.search : "")),
            i.href = i.format(),
            i
        }
        if (!_.length)
            return i.pathname = null,
            i.search ? i.path = "/" + i.search : i.path = null,
            i.href = i.format(),
            i;
        for (var T = _.slice(-1)[0], w = (i.host || t.host || _.length > 1) && ("." === T || ".." === T) || "" === T, E = 0, S = _.length; S >= 0; S--)
            T = _[S],
            "." === T ? _.splice(S, 1) : ".." === T ? (_.splice(S, 1),
            E++) : E && (_.splice(S, 1),
            E--);
        if (!m && !y)
            for (; E--; E)
                _.unshift("..");
        !m || "" === _[0] || _[0] && "/" === _[0].charAt(0) || _.unshift(""),
        w && "/" !== _.join("/").substr(-1) && _.push("");
        var I = "" === _[0] || _[0] && "/" === _[0].charAt(0);
        if (x) {
            i.hostname = i.host = I ? "" : _.length ? _.shift() : "";
            var b = !!(i.host && i.host.indexOf("@") > 0) && i.host.split("@");
            b && (i.auth = b.shift(),
            i.host = i.hostname = b.shift())
        }
        return m = m || i.host && _.length,
        m && !I && _.unshift(""),
        _.length ? i.pathname = _.join("/") : (i.pathname = null,
        i.path = null),
        Me.isNull(i.pathname) && Me.isNull(i.search) || (i.path = (i.pathname ? i.pathname : "") + (i.search ? i.search : "")),
        i.auth = t.auth || i.auth,
        i.slashes = i.slashes || t.slashes,
        i.href = i.format(),
        i
    }
    ,
    N.prototype.parseHost = function() {
        var t = this.host
          , e = Ge.exec(t);
        e && (e = e[0],
        ":" !== e && (this.port = e.substr(1)),
        t = t.substr(0, t.length - e.length)),
        t && (this.hostname = t)
    }
    ;
    var ti = {
        parse: Ne,
        resolve: Be,
        resolveObject: Ue,
        format: ke,
        Url: Xe
    }
      , ei = {
        WEBGL_LEGACY: 0,
        WEBGL: 1,
        WEBGL2: 2
    }
      , ii = {
        UNKNOWN: 0,
        WEBGL: 1,
        CANVAS: 2
    }
      , ri = {
        NORMAL: 0,
        ADD: 1,
        MULTIPLY: 2,
        SCREEN: 3,
        OVERLAY: 4,
        DARKEN: 5,
        LIGHTEN: 6,
        COLOR_DODGE: 7,
        COLOR_BURN: 8,
        HARD_LIGHT: 9,
        SOFT_LIGHT: 10,
        DIFFERENCE: 11,
        EXCLUSION: 12,
        HUE: 13,
        SATURATION: 14,
        COLOR: 15,
        LUMINOSITY: 16,
        NORMAL_NPM: 17,
        ADD_NPM: 18,
        SCREEN_NPM: 19,
        NONE: 20,
        SRC_OVER: 0,
        SRC_IN: 21,
        SRC_OUT: 22,
        SRC_ATOP: 23,
        DST_OVER: 24,
        DST_IN: 25,
        DST_OUT: 26,
        DST_ATOP: 27,
        ERASE: 26,
        SUBTRACT: 28
    }
      , ni = {
        POINTS: 0,
        LINES: 1,
        LINE_LOOP: 2,
        LINE_STRIP: 3,
        TRIANGLES: 4,
        TRIANGLE_STRIP: 5,
        TRIANGLE_FAN: 6
    }
      , oi = {
        RGBA: 6408,
        RGB: 6407,
        ALPHA: 6406,
        LUMINANCE: 6409,
        LUMINANCE_ALPHA: 6410,
        DEPTH_COMPONENT: 6402,
        DEPTH_STENCIL: 34041
    }
      , si = {
        TEXTURE_2D: 3553,
        TEXTURE_CUBE_MAP: 34067,
        TEXTURE_2D_ARRAY: 35866,
        TEXTURE_CUBE_MAP_POSITIVE_X: 34069,
        TEXTURE_CUBE_MAP_NEGATIVE_X: 34070,
        TEXTURE_CUBE_MAP_POSITIVE_Y: 34071,
        TEXTURE_CUBE_MAP_NEGATIVE_Y: 34072,
        TEXTURE_CUBE_MAP_POSITIVE_Z: 34073,
        TEXTURE_CUBE_MAP_NEGATIVE_Z: 34074
    }
      , ai = {
        UNSIGNED_BYTE: 5121,
        UNSIGNED_SHORT: 5123,
        UNSIGNED_SHORT_5_6_5: 33635,
        UNSIGNED_SHORT_4_4_4_4: 32819,
        UNSIGNED_SHORT_5_5_5_1: 32820,
        FLOAT: 5126,
        HALF_FLOAT: 36193
    }
      , hi = {
        LINEAR: 1,
        NEAREST: 0
    }
      , ui = {
        CLAMP: 33071,
        REPEAT: 10497,
        MIRRORED_REPEAT: 33648
    }
      , li = {
        OFF: 0,
        POW2: 1,
        ON: 2
    }
      , ci = {
        AUTO: 0,
        MANUAL: 1
    }
      , di = {
        LOW: "lowp",
        MEDIUM: "mediump",
        HIGH: "highp"
    };
    Ie.RETINA_PREFIX = /@([0-9\.]+)x/,
    Ie.FAIL_IF_MAJOR_PERFORMANCE_CAVEAT = !0;
    var pi, fi = !1, vi = "5.1.5", gi = function() {
        for (var t = [], e = [], i = 0; i < 32; i++)
            t[i] = i,
            e[i] = i;
        t[ri.NORMAL_NPM] = ri.NORMAL,
        t[ri.ADD_NPM] = ri.ADD,
        t[ri.SCREEN_NPM] = ri.SCREEN,
        e[ri.NORMAL] = ri.NORMAL_NPM,
        e[ri.ADD] = ri.ADD_NPM,
        e[ri.SCREEN] = ri.SCREEN_NPM;
        var r = [];
        return r.push(e),
        r.push(t),
        r
    }(), mi = 0, yi = {}, _i = Object.create(null), xi = Object.create(null), bi = function(t, e, i) {
        this.canvas = document.createElement("canvas"),
        this.context = this.canvas.getContext("2d"),
        this.resolution = i || Ie.RESOLUTION,
        this.resize(t, e)
    }, Ti = {
        width: {
            configurable: !0
        },
        height: {
            configurable: !0
        }
    };
    bi.prototype.clear = function() {
        this.context.setTransform(1, 0, 0, 1, 0, 0),
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
    }
    ,
    bi.prototype.resize = function(t, e) {
        this.canvas.width = t * this.resolution,
        this.canvas.height = e * this.resolution
    }
    ,
    bi.prototype.destroy = function() {
        this.context = null,
        this.canvas = null
    }
    ,
    Ti.width.get = function() {
        return this.canvas.width
    }
    ,
    Ti.width.set = function(t) {
        this.canvas.width = t
    }
    ,
    Ti.height.get = function() {
        return this.canvas.height
    }
    ,
    Ti.height.set = function(t) {
        this.canvas.height = t
    }
    ,
    Object.defineProperties(bi.prototype, Ti);
    var wi, Ei = /^\s*data:(?:([\w-]+)\/([\w+.-]+))?(?:;charset=([\w-]+))?(?:;(base64))?,(.*)/i, Si = {}, Ii = {
        BaseTextureCache: xi,
        CanvasRenderTarget: bi,
        DATA_URI: Ei,
        ProgramCache: yi,
        TextureCache: _i,
        clearTextureCache: st,
        correctBlendMode: q,
        createIndicesForQuads: Q,
        decomposeDataUri: ht,
        deprecation: ct,
        destroyTextureCache: ot,
        determineCrossOrigin: ut,
        getResolutionOfUrl: lt,
        hex2rgb: z,
        hex2string: V,
        isPow2: rt,
        isWebGLSupported: H,
        log2: nt,
        nextPow2: it,
        premultiplyBlendMode: gi,
        premultiplyRgba: Z,
        premultiplyTint: K,
        premultiplyTintToRgba: J,
        removeItems: $,
        rgb2hex: W,
        sayHello: G,
        sign: et,
        skipHello: j,
        string2hex: Y,
        trimCanvas: at,
        uid: tt,
        isMobile: Se,
        EventEmitter: Pe,
        earcut: Ae,
        url: ti
    }, Pi = function(t, e) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        this.x = t,
        this.y = e
    };
    Pi.prototype.clone = function() {
        return new Pi(this.x,this.y)
    }
    ,
    Pi.prototype.copyFrom = function(t) {
        return this.set(t.x, t.y),
        this
    }
    ,
    Pi.prototype.copyTo = function(t) {
        return t.set(this.x, this.y),
        t
    }
    ,
    Pi.prototype.equals = function(t) {
        return t.x === this.x && t.y === this.y
    }
    ,
    Pi.prototype.set = function(t, e) {
        this.x = t || 0,
        this.y = e || (0 !== e ? this.x : 0)
    }
    ;
    var Ai = function(t, e, i, r) {
        void 0 === i && (i = 0),
        void 0 === r && (r = 0),
        this._x = i,
        this._y = r,
        this.cb = t,
        this.scope = e
    }
      , Oi = {
        x: {
            configurable: !0
        },
        y: {
            configurable: !0
        }
    };
    Ai.prototype.clone = function(t, e) {
        void 0 === t && (t = null),
        void 0 === e && (e = null);
        var i = t || this.cb
          , r = e || this.scope;
        return new Ai(i,r,this._x,this._y)
    }
    ,
    Ai.prototype.set = function(t, e) {
        var i = t || 0
          , r = e || (0 !== e ? i : 0);
        this._x === i && this._y === r || (this._x = i,
        this._y = r,
        this.cb.call(this.scope))
    }
    ,
    Ai.prototype.copyFrom = function(t) {
        return this._x === t.x && this._y === t.y || (this._x = t.x,
        this._y = t.y,
        this.cb.call(this.scope)),
        this
    }
    ,
    Ai.prototype.copyTo = function(t) {
        return t.set(this._x, this._y),
        t
    }
    ,
    Ai.prototype.equals = function(t) {
        return t.x === this._x && t.y === this._y
    }
    ,
    Oi.x.get = function() {
        return this._x
    }
    ,
    Oi.x.set = function(t) {
        this._x !== t && (this._x = t,
        this.cb.call(this.scope))
    }
    ,
    Oi.y.get = function() {
        return this._y
    }
    ,
    Oi.y.set = function(t) {
        this._y !== t && (this._y = t,
        this.cb.call(this.scope))
    }
    ,
    Object.defineProperties(Ai.prototype, Oi);
    var Ci = 2 * Math.PI
      , Mi = 180 / Math.PI
      , Di = Math.PI / 180
      , Ri = {
        POLY: 0,
        RECT: 1,
        CIRC: 2,
        ELIP: 3,
        RREC: 4
    }
      , Fi = function(t, e, i, r, n, o) {
        void 0 === t && (t = 1),
        void 0 === e && (e = 0),
        void 0 === i && (i = 0),
        void 0 === r && (r = 1),
        void 0 === n && (n = 0),
        void 0 === o && (o = 0),
        this.a = t,
        this.b = e,
        this.c = i,
        this.d = r,
        this.tx = n,
        this.ty = o,
        this.array = null
    }
      , Li = {
        IDENTITY: {
            configurable: !0
        },
        TEMP_MATRIX: {
            configurable: !0
        }
    };
    Fi.prototype.fromArray = function(t) {
        this.a = t[0],
        this.b = t[1],
        this.c = t[3],
        this.d = t[4],
        this.tx = t[2],
        this.ty = t[5]
    }
    ,
    Fi.prototype.set = function(t, e, i, r, n, o) {
        return this.a = t,
        this.b = e,
        this.c = i,
        this.d = r,
        this.tx = n,
        this.ty = o,
        this
    }
    ,
    Fi.prototype.toArray = function(t, e) {
        this.array || (this.array = new Float32Array(9));
        var i = e || this.array;
        return t ? (i[0] = this.a,
        i[1] = this.b,
        i[2] = 0,
        i[3] = this.c,
        i[4] = this.d,
        i[5] = 0,
        i[6] = this.tx,
        i[7] = this.ty,
        i[8] = 1) : (i[0] = this.a,
        i[1] = this.c,
        i[2] = this.tx,
        i[3] = this.b,
        i[4] = this.d,
        i[5] = this.ty,
        i[6] = 0,
        i[7] = 0,
        i[8] = 1),
        i
    }
    ,
    Fi.prototype.apply = function(t, e) {
        e = e || new Pi;
        var i = t.x
          , r = t.y;
        return e.x = this.a * i + this.c * r + this.tx,
        e.y = this.b * i + this.d * r + this.ty,
        e
    }
    ,
    Fi.prototype.applyInverse = function(t, e) {
        e = e || new Pi;
        var i = 1 / (this.a * this.d + this.c * -this.b)
          , r = t.x
          , n = t.y;
        return e.x = this.d * i * r + -this.c * i * n + (this.ty * this.c - this.tx * this.d) * i,
        e.y = this.a * i * n + -this.b * i * r + (-this.ty * this.a + this.tx * this.b) * i,
        e
    }
    ,
    Fi.prototype.translate = function(t, e) {
        return this.tx += t,
        this.ty += e,
        this
    }
    ,
    Fi.prototype.scale = function(t, e) {
        return this.a *= t,
        this.d *= e,
        this.c *= t,
        this.b *= e,
        this.tx *= t,
        this.ty *= e,
        this
    }
    ,
    Fi.prototype.rotate = function(t) {
        var e = Math.cos(t)
          , i = Math.sin(t)
          , r = this.a
          , n = this.c
          , o = this.tx;
        return this.a = r * e - this.b * i,
        this.b = r * i + this.b * e,
        this.c = n * e - this.d * i,
        this.d = n * i + this.d * e,
        this.tx = o * e - this.ty * i,
        this.ty = o * i + this.ty * e,
        this
    }
    ,
    Fi.prototype.append = function(t) {
        var e = this.a
          , i = this.b
          , r = this.c
          , n = this.d;
        return this.a = t.a * e + t.b * r,
        this.b = t.a * i + t.b * n,
        this.c = t.c * e + t.d * r,
        this.d = t.c * i + t.d * n,
        this.tx = t.tx * e + t.ty * r + this.tx,
        this.ty = t.tx * i + t.ty * n + this.ty,
        this
    }
    ,
    Fi.prototype.setTransform = function(t, e, i, r, n, o, s, a, h) {
        return this.a = Math.cos(s + h) * n,
        this.b = Math.sin(s + h) * n,
        this.c = -Math.sin(s - a) * o,
        this.d = Math.cos(s - a) * o,
        this.tx = t - (i * this.a + r * this.c),
        this.ty = e - (i * this.b + r * this.d),
        this
    }
    ,
    Fi.prototype.prepend = function(t) {
        var e = this.tx;
        if (1 !== t.a || 0 !== t.b || 0 !== t.c || 1 !== t.d) {
            var i = this.a
              , r = this.c;
            this.a = i * t.a + this.b * t.c,
            this.b = i * t.b + this.b * t.d,
            this.c = r * t.a + this.d * t.c,
            this.d = r * t.b + this.d * t.d
        }
        return this.tx = e * t.a + this.ty * t.c + t.tx,
        this.ty = e * t.b + this.ty * t.d + t.ty,
        this
    }
    ,
    Fi.prototype.decompose = function(t) {
        var e = this.a
          , i = this.b
          , r = this.c
          , n = this.d
          , o = -Math.atan2(-r, n)
          , s = Math.atan2(i, e)
          , a = Math.abs(o + s);
        return a < 1e-5 || Math.abs(Ci - a) < 1e-5 ? (t.rotation = s,
        t.skew.x = t.skew.y = 0) : (t.rotation = 0,
        t.skew.x = o,
        t.skew.y = s),
        t.scale.x = Math.sqrt(e * e + i * i),
        t.scale.y = Math.sqrt(r * r + n * n),
        t.position.x = this.tx,
        t.position.y = this.ty,
        t
    }
    ,
    Fi.prototype.invert = function() {
        var t = this.a
          , e = this.b
          , i = this.c
          , r = this.d
          , n = this.tx
          , o = t * r - e * i;
        return this.a = r / o,
        this.b = -e / o,
        this.c = -i / o,
        this.d = t / o,
        this.tx = (i * this.ty - r * n) / o,
        this.ty = -(t * this.ty - e * n) / o,
        this
    }
    ,
    Fi.prototype.identity = function() {
        return this.a = 1,
        this.b = 0,
        this.c = 0,
        this.d = 1,
        this.tx = 0,
        this.ty = 0,
        this
    }
    ,
    Fi.prototype.clone = function() {
        var t = new Fi;
        return t.a = this.a,
        t.b = this.b,
        t.c = this.c,
        t.d = this.d,
        t.tx = this.tx,
        t.ty = this.ty,
        t
    }
    ,
    Fi.prototype.copyTo = function(t) {
        return t.a = this.a,
        t.b = this.b,
        t.c = this.c,
        t.d = this.d,
        t.tx = this.tx,
        t.ty = this.ty,
        t
    }
    ,
    Fi.prototype.copyFrom = function(t) {
        return this.a = t.a,
        this.b = t.b,
        this.c = t.c,
        this.d = t.d,
        this.tx = t.tx,
        this.ty = t.ty,
        this
    }
    ,
    Li.IDENTITY.get = function() {
        return new Fi
    }
    ,
    Li.TEMP_MATRIX.get = function() {
        return new Fi
    }
    ,
    Object.defineProperties(Fi, Li);
    var Ni = [1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1, 0, 1]
      , Bi = [0, 1, 1, 1, 0, -1, -1, -1, 0, 1, 1, 1, 0, -1, -1, -1]
      , Ui = [0, -1, -1, -1, 0, 1, 1, 1, 0, 1, 1, 1, 0, -1, -1, -1]
      , ki = [1, 1, 0, -1, -1, -1, 0, 1, -1, -1, 0, 1, 1, 1, 0, -1]
      , Xi = []
      , ji = []
      , Gi = Math.sign;
    !function() {
        for (var t = 0; t < 16; t++) {
            var e = [];
            Xi.push(e);
            for (var i = 0; i < 16; i++)
                for (var r = Gi(Ni[t] * Ni[i] + Ui[t] * Bi[i]), n = Gi(Bi[t] * Ni[i] + ki[t] * Bi[i]), o = Gi(Ni[t] * Ui[i] + Ui[t] * ki[i]), s = Gi(Bi[t] * Ui[i] + ki[t] * ki[i]), a = 0; a < 16; a++)
                    if (Ni[a] === r && Bi[a] === n && Ui[a] === o && ki[a] === s) {
                        e.push(a);
                        break
                    }
        }
        for (var h = 0; h < 16; h++) {
            var u = new Fi;
            u.set(Ni[h], Bi[h], Ui[h], ki[h], 0, 0),
            ji.push(u)
        }
    }();
    var Hi = {
        E: 0,
        SE: 1,
        S: 2,
        SW: 3,
        W: 4,
        NW: 5,
        N: 6,
        NE: 7,
        MIRROR_VERTICAL: 8,
        MAIN_DIAGONAL: 10,
        MIRROR_HORIZONTAL: 12,
        REVERSE_DIAGONAL: 14,
        uX: function(t) {
            return Ni[t]
        },
        uY: function(t) {
            return Bi[t]
        },
        vX: function(t) {
            return Ui[t]
        },
        vY: function(t) {
            return ki[t]
        },
        inv: function(t) {
            return 8 & t ? 15 & t : 7 & -t
        },
        add: function(t, e) {
            return Xi[t][e]
        },
        sub: function(t, e) {
            return Xi[t][Hi.inv(e)]
        },
        rotate180: function(t) {
            return 4 ^ t
        },
        isVertical: function(t) {
            return 2 == (3 & t)
        },
        byDirection: function(t, e) {
            return 2 * Math.abs(t) <= Math.abs(e) ? e >= 0 ? Hi.S : Hi.N : 2 * Math.abs(e) <= Math.abs(t) ? t > 0 ? Hi.E : Hi.W : e > 0 ? t > 0 ? Hi.SE : Hi.SW : t > 0 ? Hi.NE : Hi.NW
        },
        matrixAppendRotationInv: function(t, e, i, r) {
            void 0 === i && (i = 0),
            void 0 === r && (r = 0);
            var n = ji[Hi.inv(e)];
            n.tx = i,
            n.ty = r,
            t.append(n)
        }
    }
      , zi = function() {
        this.worldTransform = new Fi,
        this.localTransform = new Fi,
        this.position = new Ai(this.onChange,this,0,0),
        this.scale = new Ai(this.onChange,this,1,1),
        this.pivot = new Ai(this.onChange,this,0,0),
        this.skew = new Ai(this.updateSkew,this,0,0),
        this._rotation = 0,
        this._cx = 1,
        this._sx = 0,
        this._cy = 0,
        this._sy = 1,
        this._localID = 0,
        this._currentLocalID = 0,
        this._worldID = 0,
        this._parentID = 0
    }
      , Vi = {
        rotation: {
            configurable: !0
        }
    };
    zi.prototype.onChange = function() {
        this._localID++
    }
    ,
    zi.prototype.updateSkew = function() {
        this._cx = Math.cos(this._rotation + this.skew._y),
        this._sx = Math.sin(this._rotation + this.skew._y),
        this._cy = -Math.sin(this._rotation - this.skew._x),
        this._sy = Math.cos(this._rotation - this.skew._x),
        this._localID++
    }
    ,
    zi.prototype.updateLocalTransform = function() {
        var t = this.localTransform;
        this._localID !== this._currentLocalID && (t.a = this._cx * this.scale._x,
        t.b = this._sx * this.scale._x,
        t.c = this._cy * this.scale._y,
        t.d = this._sy * this.scale._y,
        t.tx = this.position._x - (this.pivot._x * t.a + this.pivot._y * t.c),
        t.ty = this.position._y - (this.pivot._x * t.b + this.pivot._y * t.d),
        this._currentLocalID = this._localID,
        this._parentID = -1)
    }
    ,
    zi.prototype.updateTransform = function(t) {
        var e = this.localTransform;
        if (this._localID !== this._currentLocalID && (e.a = this._cx * this.scale._x,
        e.b = this._sx * this.scale._x,
        e.c = this._cy * this.scale._y,
        e.d = this._sy * this.scale._y,
        e.tx = this.position._x - (this.pivot._x * e.a + this.pivot._y * e.c),
        e.ty = this.position._y - (this.pivot._x * e.b + this.pivot._y * e.d),
        this._currentLocalID = this._localID,
        this._parentID = -1),
        this._parentID !== t._worldID) {
            var i = t.worldTransform
              , r = this.worldTransform;
            r.a = e.a * i.a + e.b * i.c,
            r.b = e.a * i.b + e.b * i.d,
            r.c = e.c * i.a + e.d * i.c,
            r.d = e.c * i.b + e.d * i.d,
            r.tx = e.tx * i.a + e.ty * i.c + i.tx,
            r.ty = e.tx * i.b + e.ty * i.d + i.ty,
            this._parentID = t._worldID,
            this._worldID++
        }
    }
    ,
    zi.prototype.setFromMatrix = function(t) {
        t.decompose(this),
        this._localID++
    }
    ,
    Vi.rotation.get = function() {
        return this._rotation
    }
    ,
    Vi.rotation.set = function(t) {
        this._rotation !== t && (this._rotation = t,
        this.updateSkew())
    }
    ,
    Object.defineProperties(zi.prototype, Vi),
    zi.IDENTITY = new zi;
    var Yi = function(t, e, i, r) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === i && (i = 0),
        void 0 === r && (r = 0),
        this.x = Number(t),
        this.y = Number(e),
        this.width = Number(i),
        this.height = Number(r),
        this.type = Ri.RECT
    }
      , Wi = {
        left: {
            configurable: !0
        },
        right: {
            configurable: !0
        },
        top: {
            configurable: !0
        },
        bottom: {
            configurable: !0
        }
    }
      , qi = {
        EMPTY: {
            configurable: !0
        }
    };
    Wi.left.get = function() {
        return this.x
    }
    ,
    Wi.right.get = function() {
        return this.x + this.width
    }
    ,
    Wi.top.get = function() {
        return this.y
    }
    ,
    Wi.bottom.get = function() {
        return this.y + this.height
    }
    ,
    qi.EMPTY.get = function() {
        return new Yi(0,0,0,0)
    }
    ,
    Yi.prototype.clone = function() {
        return new Yi(this.x,this.y,this.width,this.height)
    }
    ,
    Yi.prototype.copyFrom = function(t) {
        return this.x = t.x,
        this.y = t.y,
        this.width = t.width,
        this.height = t.height,
        this
    }
    ,
    Yi.prototype.copyTo = function(t) {
        return t.x = this.x,
        t.y = this.y,
        t.width = this.width,
        t.height = this.height,
        t
    }
    ,
    Yi.prototype.contains = function(t, e) {
        return !(this.width <= 0 || this.height <= 0) && (t >= this.x && t < this.x + this.width && e >= this.y && e < this.y + this.height)
    }
    ,
    Yi.prototype.pad = function(t, e) {
        t = t || 0,
        e = e || (0 !== e ? t : 0),
        this.x -= t,
        this.y -= e,
        this.width += 2 * t,
        this.height += 2 * e
    }
    ,
    Yi.prototype.fit = function(t) {
        var e = Math.max(this.x, t.x)
          , i = Math.min(this.x + this.width, t.x + t.width)
          , r = Math.max(this.y, t.y)
          , n = Math.min(this.y + this.height, t.y + t.height);
        this.x = e,
        this.width = Math.max(i - e, 0),
        this.y = r,
        this.height = Math.max(n - r, 0)
    }
    ,
    Yi.prototype.ceil = function(t, e) {
        void 0 === t && (t = 1),
        void 0 === e && (e = .001);
        var i = Math.ceil((this.x + this.width - e) * t) / t
          , r = Math.ceil((this.y + this.height - e) * t) / t;
        this.x = Math.floor((this.x + e) * t) / t,
        this.y = Math.floor((this.y + e) * t) / t,
        this.width = i - this.x,
        this.height = r - this.y
    }
    ,
    Yi.prototype.enlarge = function(t) {
        var e = Math.min(this.x, t.x)
          , i = Math.max(this.x + this.width, t.x + t.width)
          , r = Math.min(this.y, t.y)
          , n = Math.max(this.y + this.height, t.y + t.height);
        this.x = e,
        this.width = i - e,
        this.y = r,
        this.height = n - r
    }
    ,
    Object.defineProperties(Yi.prototype, Wi),
    Object.defineProperties(Yi, qi);
    var Zi = function(t, e, i) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === i && (i = 0),
        this.x = t,
        this.y = e,
        this.radius = i,
        this.type = Ri.CIRC
    };
    Zi.prototype.clone = function() {
        return new Zi(this.x,this.y,this.radius)
    }
    ,
    Zi.prototype.contains = function(t, e) {
        if (this.radius <= 0)
            return !1;
        var i = this.radius * this.radius
          , r = this.x - t
          , n = this.y - e;
        return r *= r,
        n *= n,
        r + n <= i
    }
    ,
    Zi.prototype.getBounds = function() {
        return new Yi(this.x - this.radius,this.y - this.radius,2 * this.radius,2 * this.radius)
    }
    ;
    var Ki = function(t, e, i, r) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === i && (i = 0),
        void 0 === r && (r = 0),
        this.x = t,
        this.y = e,
        this.width = i,
        this.height = r,
        this.type = Ri.ELIP
    };
    Ki.prototype.clone = function() {
        return new Ki(this.x,this.y,this.width,this.height)
    }
    ,
    Ki.prototype.contains = function(t, e) {
        if (this.width <= 0 || this.height <= 0)
            return !1;
        var i = (t - this.x) / this.width
          , r = (e - this.y) / this.height;
        return i *= i,
        r *= r,
        i + r <= 1
    }
    ,
    Ki.prototype.getBounds = function() {
        return new Yi(this.x - this.width,this.y - this.height,this.width,this.height)
    }
    ;
    var Ji = function() {
        for (var t = arguments, e = [], i = arguments.length; i--; )
            e[i] = t[i];
        if (Array.isArray(e[0]) && (e = e[0]),
        e[0]instanceof Pi) {
            for (var r = [], n = 0, o = e.length; n < o; n++)
                r.push(e[n].x, e[n].y);
            e = r
        }
        this.points = e,
        this.type = Ri.POLY,
        this.closeStroke = !0
    };
    Ji.prototype.clone = function() {
        var t = new Ji(this.points.slice());
        return t.closeStroke = this.closeStroke,
        t
    }
    ,
    Ji.prototype.contains = function(t, e) {
        for (var i = !1, r = this.points.length / 2, n = 0, o = r - 1; n < r; o = n++) {
            var s = this.points[2 * n]
              , a = this.points[2 * n + 1]
              , h = this.points[2 * o]
              , u = this.points[2 * o + 1];
            a > e != u > e && t < (e - a) / (u - a) * (h - s) + s && (i = !i)
        }
        return i
    }
    ;
    var Qi = function(t, e, i, r, n) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        void 0 === i && (i = 0),
        void 0 === r && (r = 0),
        void 0 === n && (n = 20),
        this.x = t,
        this.y = e,
        this.width = i,
        this.height = r,
        this.radius = n,
        this.type = Ri.RREC
    };
    Qi.prototype.clone = function() {
        return new Qi(this.x,this.y,this.width,this.height,this.radius)
    }
    ,
    Qi.prototype.contains = function(t, e) {
        if (this.width <= 0 || this.height <= 0)
            return !1;
        if (t >= this.x && t <= this.x + this.width && e >= this.y && e <= this.y + this.height) {
            if (e >= this.y + this.radius && e <= this.y + this.height - this.radius || t >= this.x + this.radius && t <= this.x + this.width - this.radius)
                return !0;
            var i = t - (this.x + this.radius)
              , r = e - (this.y + this.radius)
              , n = this.radius * this.radius;
            if (i * i + r * r <= n)
                return !0;
            if ((i = t - (this.x + this.width - this.radius)) * i + r * r <= n)
                return !0;
            if (r = e - (this.y + this.height - this.radius),
            i * i + r * r <= n)
                return !0;
            if ((i = t - (this.x + this.radius)) * i + r * r <= n)
                return !0
        }
        return !1
    }
    ,
    Ie.SORTABLE_CHILDREN = !1;
    var $i = function() {
        this.minX = 1 / 0,
        this.minY = 1 / 0,
        this.maxX = -1 / 0,
        this.maxY = -1 / 0,
        this.rect = null
    };
    $i.prototype.isEmpty = function() {
        return this.minX > this.maxX || this.minY > this.maxY
    }
    ,
    $i.prototype.clear = function() {
        this.updateID++,
        this.minX = 1 / 0,
        this.minY = 1 / 0,
        this.maxX = -1 / 0,
        this.maxY = -1 / 0
    }
    ,
    $i.prototype.getRectangle = function(t) {
        return this.minX > this.maxX || this.minY > this.maxY ? Yi.EMPTY : (t = t || new Yi(0,0,1,1),
        t.x = this.minX,
        t.y = this.minY,
        t.width = this.maxX - this.minX,
        t.height = this.maxY - this.minY,
        t)
    }
    ,
    $i.prototype.addPoint = function(t) {
        this.minX = Math.min(this.minX, t.x),
        this.maxX = Math.max(this.maxX, t.x),
        this.minY = Math.min(this.minY, t.y),
        this.maxY = Math.max(this.maxY, t.y)
    }
    ,
    $i.prototype.addQuad = function(t) {
        var e = this.minX
          , i = this.minY
          , r = this.maxX
          , n = this.maxY
          , o = t[0]
          , s = t[1];
        e = o < e ? o : e,
        i = s < i ? s : i,
        r = o > r ? o : r,
        n = s > n ? s : n,
        o = t[2],
        s = t[3],
        e = o < e ? o : e,
        i = s < i ? s : i,
        r = o > r ? o : r,
        n = s > n ? s : n,
        o = t[4],
        s = t[5],
        e = o < e ? o : e,
        i = s < i ? s : i,
        r = o > r ? o : r,
        n = s > n ? s : n,
        o = t[6],
        s = t[7],
        e = o < e ? o : e,
        i = s < i ? s : i,
        r = o > r ? o : r,
        n = s > n ? s : n,
        this.minX = e,
        this.minY = i,
        this.maxX = r,
        this.maxY = n
    }
    ,
    $i.prototype.addFrame = function(t, e, i, r, n) {
        var o = t.worldTransform
          , s = o.a
          , a = o.b
          , h = o.c
          , u = o.d
          , l = o.tx
          , c = o.ty
          , d = this.minX
          , p = this.minY
          , f = this.maxX
          , v = this.maxY
          , g = s * e + h * i + l
          , m = a * e + u * i + c;
        d = g < d ? g : d,
        p = m < p ? m : p,
        f = g > f ? g : f,
        v = m > v ? m : v,
        g = s * r + h * i + l,
        m = a * r + u * i + c,
        d = g < d ? g : d,
        p = m < p ? m : p,
        f = g > f ? g : f,
        v = m > v ? m : v,
        g = s * e + h * n + l,
        m = a * e + u * n + c,
        d = g < d ? g : d,
        p = m < p ? m : p,
        f = g > f ? g : f,
        v = m > v ? m : v,
        g = s * r + h * n + l,
        m = a * r + u * n + c,
        d = g < d ? g : d,
        p = m < p ? m : p,
        f = g > f ? g : f,
        v = m > v ? m : v,
        this.minX = d,
        this.minY = p,
        this.maxX = f,
        this.maxY = v
    }
    ,
    $i.prototype.addVertexData = function(t, e, i) {
        for (var r = this.minX, n = this.minY, o = this.maxX, s = this.maxY, a = e; a < i; a += 2) {
            var h = t[a]
              , u = t[a + 1];
            r = h < r ? h : r,
            n = u < n ? u : n,
            o = h > o ? h : o,
            s = u > s ? u : s
        }
        this.minX = r,
        this.minY = n,
        this.maxX = o,
        this.maxY = s
    }
    ,
    $i.prototype.addVertices = function(t, e, i, r) {
        for (var n = t.worldTransform, o = n.a, s = n.b, a = n.c, h = n.d, u = n.tx, l = n.ty, c = this.minX, d = this.minY, p = this.maxX, f = this.maxY, v = i; v < r; v += 2) {
            var g = e[v]
              , m = e[v + 1]
              , y = o * g + a * m + u
              , _ = h * m + s * g + l;
            c = y < c ? y : c,
            d = _ < d ? _ : d,
            p = y > p ? y : p,
            f = _ > f ? _ : f
        }
        this.minX = c,
        this.minY = d,
        this.maxX = p,
        this.maxY = f
    }
    ,
    $i.prototype.addBounds = function(t) {
        var e = this.minX
          , i = this.minY
          , r = this.maxX
          , n = this.maxY;
        this.minX = t.minX < e ? t.minX : e,
        this.minY = t.minY < i ? t.minY : i,
        this.maxX = t.maxX > r ? t.maxX : r,
        this.maxY = t.maxY > n ? t.maxY : n
    }
    ,
    $i.prototype.addBoundsMask = function(t, e) {
        var i = t.minX > e.minX ? t.minX : e.minX
          , r = t.minY > e.minY ? t.minY : e.minY
          , n = t.maxX < e.maxX ? t.maxX : e.maxX
          , o = t.maxY < e.maxY ? t.maxY : e.maxY;
        if (i <= n && r <= o) {
            var s = this.minX
              , a = this.minY
              , h = this.maxX
              , u = this.maxY;
            this.minX = i < s ? i : s,
            this.minY = r < a ? r : a,
            this.maxX = n > h ? n : h,
            this.maxY = o > u ? o : u
        }
    }
    ,
    $i.prototype.addBoundsArea = function(t, e) {
        var i = t.minX > e.x ? t.minX : e.x
          , r = t.minY > e.y ? t.minY : e.y
          , n = t.maxX < e.x + e.width ? t.maxX : e.x + e.width
          , o = t.maxY < e.y + e.height ? t.maxY : e.y + e.height;
        if (i <= n && r <= o) {
            var s = this.minX
              , a = this.minY
              , h = this.maxX
              , u = this.maxY;
            this.minX = i < s ? i : s,
            this.minY = r < a ? r : a,
            this.maxX = n > h ? n : h,
            this.maxY = o > u ? o : u
        }
    }
    ;
    var tr = function(t) {
        function e() {
            t.call(this),
            this.tempDisplayObjectParent = null,
            this.transform = new zi,
            this.alpha = 1,
            this.visible = !0,
            this.renderable = !0,
            this.parent = null,
            this.worldAlpha = 1,
            this._lastSortedIndex = 0,
            this._zIndex = 0,
            this.filterArea = null,
            this.filters = null,
            this._enabledFilters = null,
            this._bounds = new $i,
            this._boundsID = 0,
            this._lastBoundsID = -1,
            this._boundsRect = null,
            this._localBoundsRect = null,
            this._mask = null,
            this._destroyed = !1,
            this.isSprite = !1
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            _tempDisplayObjectParent: {
                configurable: !0
            },
            x: {
                configurable: !0
            },
            y: {
                configurable: !0
            },
            worldTransform: {
                configurable: !0
            },
            localTransform: {
                configurable: !0
            },
            position: {
                configurable: !0
            },
            scale: {
                configurable: !0
            },
            pivot: {
                configurable: !0
            },
            skew: {
                configurable: !0
            },
            rotation: {
                configurable: !0
            },
            angle: {
                configurable: !0
            },
            zIndex: {
                configurable: !0
            },
            worldVisible: {
                configurable: !0
            },
            mask: {
                configurable: !0
            }
        };
        return e.mixin = function(t) {
            for (var i = Object.keys(t), r = 0; r < i.length; ++r) {
                var n = i[r];
                Object.defineProperty(e.prototype, n, Object.getOwnPropertyDescriptor(t, n))
            }
        }
        ,
        i._tempDisplayObjectParent.get = function() {
            return null === this.tempDisplayObjectParent && (this.tempDisplayObjectParent = new e),
            this.tempDisplayObjectParent
        }
        ,
        e.prototype.updateTransform = function() {
            this.transform.updateTransform(this.parent.transform),
            this.worldAlpha = this.alpha * this.parent.worldAlpha,
            this._bounds.updateID++
        }
        ,
        e.prototype._recursivePostUpdateTransform = function() {
            this.parent ? (this.parent._recursivePostUpdateTransform(),
            this.transform.updateTransform(this.parent.transform)) : this.transform.updateTransform(this._tempDisplayObjectParent.transform)
        }
        ,
        e.prototype.getBounds = function(t, e) {
            return t || (this.parent ? (this._recursivePostUpdateTransform(),
            this.updateTransform()) : (this.parent = this._tempDisplayObjectParent,
            this.updateTransform(),
            this.parent = null)),
            this._boundsID !== this._lastBoundsID && (this.calculateBounds(),
            this._lastBoundsID = this._boundsID),
            e || (this._boundsRect || (this._boundsRect = new Yi),
            e = this._boundsRect),
            this._bounds.getRectangle(e)
        }
        ,
        e.prototype.getLocalBounds = function(t) {
            var e = this.transform
              , i = this.parent;
            this.parent = null,
            this.transform = this._tempDisplayObjectParent.transform,
            t || (this._localBoundsRect || (this._localBoundsRect = new Yi),
            t = this._localBoundsRect);
            var r = this.getBounds(!1, t);
            return this.parent = i,
            this.transform = e,
            r
        }
        ,
        e.prototype.toGlobal = function(t, e, i) {
            return void 0 === i && (i = !1),
            i || (this._recursivePostUpdateTransform(),
            this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent,
            this.displayObjectUpdateTransform(),
            this.parent = null)),
            this.worldTransform.apply(t, e)
        }
        ,
        e.prototype.toLocal = function(t, e, i, r) {
            return e && (t = e.toGlobal(t, i, r)),
            r || (this._recursivePostUpdateTransform(),
            this.parent ? this.displayObjectUpdateTransform() : (this.parent = this._tempDisplayObjectParent,
            this.displayObjectUpdateTransform(),
            this.parent = null)),
            this.worldTransform.applyInverse(t, i)
        }
        ,
        e.prototype.render = function(t) {}
        ,
        e.prototype.setParent = function(t) {
            if (!t || !t.addChild)
                throw new Error("setParent: Argument must be a Container");
            return t.addChild(this),
            t
        }
        ,
        e.prototype.setTransform = function(t, e, i, r, n, o, s, a, h) {
            return void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            void 0 === i && (i = 1),
            void 0 === r && (r = 1),
            void 0 === n && (n = 0),
            void 0 === o && (o = 0),
            void 0 === s && (s = 0),
            void 0 === a && (a = 0),
            void 0 === h && (h = 0),
            this.position.x = t,
            this.position.y = e,
            this.scale.x = i || 1,
            this.scale.y = r || 1,
            this.rotation = n,
            this.skew.x = o,
            this.skew.y = s,
            this.pivot.x = a,
            this.pivot.y = h,
            this
        }
        ,
        e.prototype.destroy = function() {
            this.removeAllListeners(),
            this.parent && this.parent.removeChild(this),
            this.transform = null,
            this.parent = null,
            this._bounds = null,
            this._currentBounds = null,
            this._mask = null,
            this.filterArea = null,
            this.interactive = !1,
            this.interactiveChildren = !1,
            this._destroyed = !0
        }
        ,
        i.x.get = function() {
            return this.position.x
        }
        ,
        i.x.set = function(t) {
            this.transform.position.x = t
        }
        ,
        i.y.get = function() {
            return this.position.y
        }
        ,
        i.y.set = function(t) {
            this.transform.position.y = t
        }
        ,
        i.worldTransform.get = function() {
            return this.transform.worldTransform
        }
        ,
        i.localTransform.get = function() {
            return this.transform.localTransform
        }
        ,
        i.position.get = function() {
            return this.transform.position
        }
        ,
        i.position.set = function(t) {
            this.transform.position.copyFrom(t)
        }
        ,
        i.scale.get = function() {
            return this.transform.scale
        }
        ,
        i.scale.set = function(t) {
            this.transform.scale.copyFrom(t)
        }
        ,
        i.pivot.get = function() {
            return this.transform.pivot
        }
        ,
        i.pivot.set = function(t) {
            this.transform.pivot.copyFrom(t)
        }
        ,
        i.skew.get = function() {
            return this.transform.skew
        }
        ,
        i.skew.set = function(t) {
            this.transform.skew.copyFrom(t)
        }
        ,
        i.rotation.get = function() {
            return this.transform.rotation
        }
        ,
        i.rotation.set = function(t) {
            this.transform.rotation = t
        }
        ,
        i.angle.get = function() {
            return this.transform.rotation * Mi
        }
        ,
        i.angle.set = function(t) {
            this.transform.rotation = t * Di
        }
        ,
        i.zIndex.get = function() {
            return this._zIndex
        }
        ,
        i.zIndex.set = function(t) {
            this._zIndex = t,
            this.parent && (this.parent.sortDirty = !0)
        }
        ,
        i.worldVisible.get = function() {
            var t = this;
            do {
                if (!t.visible)
                    return !1;
                t = t.parent
            } while (t);
            return !0
        }
        ,
        i.mask.get = function() {
            return this._mask
        }
        ,
        i.mask.set = function(t) {
            this._mask && (this._mask.renderable = !0,
            this._mask.isMask = !1),
            this._mask = t,
            this._mask && (this._mask.renderable = !1,
            this._mask.isMask = !0)
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Pe);
    tr.prototype.displayObjectUpdateTransform = tr.prototype.updateTransform;
    var er = function(t) {
        function e() {
            t.call(this),
            this.children = [],
            this.sortableChildren = Ie.SORTABLE_CHILDREN,
            this.sortDirty = !1
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            width: {
                configurable: !0
            },
            height: {
                configurable: !0
            }
        };
        return e.prototype.onChildrenChange = function() {}
        ,
        e.prototype.addChild = function(t) {
            var e = arguments
              , i = arguments.length;
            if (i > 1)
                for (var r = 0; r < i; r++)
                    this.addChild(e[r]);
            else
                t.parent && t.parent.removeChild(t),
                t.parent = this,
                this.sortDirty = !0,
                t.transform._parentID = -1,
                this.children.push(t),
                this._boundsID++,
                this.onChildrenChange(this.children.length - 1),
                this.emit("childAdded", t, this, this.children.length - 1),
                t.emit("added", this);
            return t
        }
        ,
        e.prototype.addChildAt = function(t, e) {
            if (e < 0 || e > this.children.length)
                throw new Error(t + "addChildAt: The index " + e + " supplied is out of bounds " + this.children.length);
            return t.parent && t.parent.removeChild(t),
            t.parent = this,
            this.sortDirty = !0,
            t.transform._parentID = -1,
            this.children.splice(e, 0, t),
            this._boundsID++,
            this.onChildrenChange(e),
            t.emit("added", this),
            this.emit("childAdded", t, this, e),
            t
        }
        ,
        e.prototype.swapChildren = function(t, e) {
            if (t !== e) {
                var i = this.getChildIndex(t)
                  , r = this.getChildIndex(e);
                this.children[i] = e,
                this.children[r] = t,
                this.onChildrenChange(i < r ? i : r)
            }
        }
        ,
        e.prototype.getChildIndex = function(t) {
            var e = this.children.indexOf(t);
            if (-1 === e)
                throw new Error("The supplied DisplayObject must be a child of the caller");
            return e
        }
        ,
        e.prototype.setChildIndex = function(t, e) {
            if (e < 0 || e >= this.children.length)
                throw new Error("The index " + e + " supplied is out of bounds " + this.children.length);
            var i = this.getChildIndex(t);
            $(this.children, i, 1),
            this.children.splice(e, 0, t),
            this.onChildrenChange(e)
        }
        ,
        e.prototype.getChildAt = function(t) {
            if (t < 0 || t >= this.children.length)
                throw new Error("getChildAt: Index (" + t + ") does not exist.");
            return this.children[t]
        }
        ,
        e.prototype.removeChild = function(t) {
            var e = arguments
              , i = arguments.length;
            if (i > 1)
                for (var r = 0; r < i; r++)
                    this.removeChild(e[r]);
            else {
                var n = this.children.indexOf(t);
                if (-1 === n)
                    return null;
                t.parent = null,
                t.transform._parentID = -1,
                $(this.children, n, 1),
                this._boundsID++,
                this.onChildrenChange(n),
                t.emit("removed", this),
                this.emit("childRemoved", t, this, n)
            }
            return t
        }
        ,
        e.prototype.removeChildAt = function(t) {
            var e = this.getChildAt(t);
            return e.parent = null,
            e.transform._parentID = -1,
            $(this.children, t, 1),
            this._boundsID++,
            this.onChildrenChange(t),
            e.emit("removed", this),
            this.emit("childRemoved", e, this, t),
            e
        }
        ,
        e.prototype.removeChildren = function(t, e) {
            void 0 === t && (t = 0);
            var i, r = t, n = "number" == typeof e ? e : this.children.length, o = n - r;
            if (o > 0 && o <= n) {
                i = this.children.splice(r, o);
                for (var s = 0; s < i.length; ++s)
                    i[s].parent = null,
                    i[s].transform && (i[s].transform._parentID = -1);
                this._boundsID++,
                this.onChildrenChange(t);
                for (var a = 0; a < i.length; ++a)
                    i[a].emit("removed", this),
                    this.emit("childRemoved", i[a], this, a);
                return i
            }
            if (0 === o && 0 === this.children.length)
                return [];
            throw new RangeError("removeChildren: numeric values are outside the acceptable range.")
        }
        ,
        e.prototype.sortChildren = function() {
            for (var t = !1, e = 0, i = this.children.length; e < i; ++e) {
                var r = this.children[e];
                r._lastSortedIndex = e,
                t || 0 === r.zIndex || (t = !0)
            }
            t && this.children.length > 1 && this.children.sort(dt),
            this.sortDirty = !1
        }
        ,
        e.prototype.updateTransform = function() {
            this.sortableChildren && this.sortDirty && this.sortChildren(),
            this._boundsID++,
            this.transform.updateTransform(this.parent.transform),
            this.worldAlpha = this.alpha * this.parent.worldAlpha;
            for (var t = 0, e = this.children.length; t < e; ++t) {
                var i = this.children[t];
                i.visible && i.updateTransform()
            }
        }
        ,
        e.prototype.calculateBounds = function() {
            this._bounds.clear(),
            this._calculateBounds();
            for (var t = 0; t < this.children.length; t++) {
                var e = this.children[t];
                e.visible && e.renderable && (e.calculateBounds(),
                e._mask ? (e._mask.calculateBounds(),
                this._bounds.addBoundsMask(e._bounds, e._mask._bounds)) : e.filterArea ? this._bounds.addBoundsArea(e._bounds, e.filterArea) : this._bounds.addBounds(e._bounds))
            }
            this._lastBoundsID = this._boundsID
        }
        ,
        e.prototype._calculateBounds = function() {}
        ,
        e.prototype.render = function(t) {
            if (this.visible && !(this.worldAlpha <= 0) && this.renderable)
                if (this._mask || this.filters && this.filters.length)
                    this.renderAdvanced(t);
                else {
                    this._render(t);
                    for (var e = 0, i = this.children.length; e < i; ++e)
                        this.children[e].render(t)
                }
        }
        ,
        e.prototype.renderAdvanced = function(t) {
            t.batch.flush();
            var e = this.filters
              , i = this._mask;
            if (e) {
                this._enabledFilters || (this._enabledFilters = []),
                this._enabledFilters.length = 0;
                for (var r = 0; r < e.length; r++)
                    e[r].enabled && this._enabledFilters.push(e[r]);
                this._enabledFilters.length && t.filter.push(this, this._enabledFilters)
            }
            i && t.mask.push(this, this._mask),
            this._render(t);
            for (var n = 0, o = this.children.length; n < o; n++)
                this.children[n].render(t);
            t.batch.flush(),
            i && t.mask.pop(this, this._mask),
            e && this._enabledFilters && this._enabledFilters.length && t.filter.pop()
        }
        ,
        e.prototype._render = function(t) {}
        ,
        e.prototype.destroy = function(e) {
            t.prototype.destroy.call(this),
            this.sortDirty = !1;
            var i = "boolean" == typeof e ? e : e && e.children
              , r = this.removeChildren(0, this.children.length);
            if (i)
                for (var n = 0; n < r.length; ++n)
                    r[n].destroy(e)
        }
        ,
        i.width.get = function() {
            return this.scale.x * this.getLocalBounds().width
        }
        ,
        i.width.set = function(t) {
            var e = this.getLocalBounds().width;
            this.scale.x = 0 !== e ? t / e : 1,
            this._width = t
        }
        ,
        i.height.get = function() {
            return this.scale.y * this.getLocalBounds().height
        }
        ,
        i.height.set = function(t) {
            var e = this.getLocalBounds().height;
            this.scale.y = 0 !== e ? t / e : 1,
            this._height = t
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(tr);
    er.prototype.containerUpdateTransform = er.prototype.updateTransform;
    var ir = {
        accessible: !1,
        accessibleTitle: null,
        accessibleHint: null,
        tabIndex: 0,
        _accessibleActive: !1,
        _accessibleDiv: !1
    };
    tr.mixin(ir);
    var rr = function(t) {
        this._hookDiv = null,
        (Se.tablet || Se.phone) && this.createTouchHook();
        var e = document.createElement("div");
        e.style.width = "100px",
        e.style.height = "100px",
        e.style.position = "absolute",
        e.style.top = "0px",
        e.style.left = "0px",
        e.style.zIndex = 2,
        this.div = e,
        this.pool = [],
        this.renderId = 0,
        this.debug = !1,
        this.renderer = t,
        this.children = [],
        this._onKeyDown = this._onKeyDown.bind(this),
        this._onMouseMove = this._onMouseMove.bind(this),
        this.isActive = !1,
        this.isMobileAccessibility = !1,
        window.addEventListener("keydown", this._onKeyDown, !1)
    };
    rr.prototype.createTouchHook = function() {
        var t = this
          , e = document.createElement("button");
        e.style.width = "1px",
        e.style.height = "1px",
        e.style.position = "absolute",
        e.style.top = "-1000px",
        e.style.left = "-1000px",
        e.style.zIndex = 2,
        e.style.backgroundColor = "#FF0000",
        e.title = "HOOK DIV",
        e.addEventListener("focus", function() {
            t.isMobileAccessibility = !0,
            t.activate(),
            t.destroyTouchHook()
        }),
        document.body.appendChild(e),
        this._hookDiv = e
    }
    ,
    rr.prototype.destroyTouchHook = function() {
        this._hookDiv && (document.body.removeChild(this._hookDiv),
        this._hookDiv = null)
    }
    ,
    rr.prototype.activate = function() {
        this.isActive || (this.isActive = !0,
        window.document.addEventListener("mousemove", this._onMouseMove, !0),
        window.removeEventListener("keydown", this._onKeyDown, !1),
        this.renderer.on("postrender", this.update, this),
        this.renderer.view.parentNode && this.renderer.view.parentNode.appendChild(this.div))
    }
    ,
    rr.prototype.deactivate = function() {
        this.isActive && !this.isMobileAccessibility && (this.isActive = !1,
        window.document.removeEventListener("mousemove", this._onMouseMove, !0),
        window.addEventListener("keydown", this._onKeyDown, !1),
        this.renderer.off("postrender", this.update),
        this.div.parentNode && this.div.parentNode.removeChild(this.div))
    }
    ,
    rr.prototype.updateAccessibleObjects = function(t) {
        if (t.visible) {
            t.accessible && t.interactive && (t._accessibleActive || this.addChild(t),
            t.renderId = this.renderId);
            for (var e = t.children, i = 0; i < e.length; i++)
                this.updateAccessibleObjects(e[i])
        }
    }
    ,
    rr.prototype.update = function() {
        if (this.renderer.renderingToScreen) {
            this.updateAccessibleObjects(this.renderer._lastObjectRendered);
            var t = this.renderer.view.getBoundingClientRect()
              , e = t.width / this.renderer.width
              , i = t.height / this.renderer.height
              , r = this.div;
            r.style.left = t.left + "px",
            r.style.top = t.top + "px",
            r.style.width = this.renderer.width + "px",
            r.style.height = this.renderer.height + "px";
            for (var n = 0; n < this.children.length; n++) {
                var o = this.children[n];
                if (o.renderId !== this.renderId)
                    o._accessibleActive = !1,
                    $(this.children, n, 1),
                    this.div.removeChild(o._accessibleDiv),
                    this.pool.push(o._accessibleDiv),
                    o._accessibleDiv = null,
                    n--,
                    0 === this.children.length && this.deactivate();
                else {
                    r = o._accessibleDiv;
                    var s = o.hitArea
                      , a = o.worldTransform;
                    o.hitArea ? (r.style.left = (a.tx + s.x * a.a) * e + "px",
                    r.style.top = (a.ty + s.y * a.d) * i + "px",
                    r.style.width = s.width * a.a * e + "px",
                    r.style.height = s.height * a.d * i + "px") : (s = o.getBounds(),
                    this.capHitArea(s),
                    r.style.left = s.x * e + "px",
                    r.style.top = s.y * i + "px",
                    r.style.width = s.width * e + "px",
                    r.style.height = s.height * i + "px",
                    r.title !== o.accessibleTitle && null !== o.accessibleTitle && (r.title = o.accessibleTitle),
                    r.getAttribute("aria-label") !== o.accessibleHint && null !== o.accessibleHint && r.setAttribute("aria-label", o.accessibleHint))
                }
            }
            this.renderId++
        }
    }
    ,
    rr.prototype.capHitArea = function(t) {
        t.x < 0 && (t.width += t.x,
        t.x = 0),
        t.y < 0 && (t.height += t.y,
        t.y = 0),
        t.x + t.width > this.renderer.width && (t.width = this.renderer.width - t.x),
        t.y + t.height > this.renderer.height && (t.height = this.renderer.height - t.y)
    }
    ,
    rr.prototype.addChild = function(t) {
        var e = this.pool.pop();
        e || (e = document.createElement("button"),
        e.style.width = "100px",
        e.style.height = "100px",
        e.style.backgroundColor = this.debug ? "rgba(255,0,0,0.5)" : "transparent",
        e.style.position = "absolute",
        e.style.zIndex = 2,
        e.style.borderStyle = "none",
        navigator.userAgent.toLowerCase().indexOf("chrome") > -1 ? e.setAttribute("aria-live", "off") : e.setAttribute("aria-live", "polite"),
        navigator.userAgent.match(/rv:.*Gecko\//) ? e.setAttribute("aria-relevant", "additions") : e.setAttribute("aria-relevant", "text"),
        e.addEventListener("click", this._onClick.bind(this)),
        e.addEventListener("focus", this._onFocus.bind(this)),
        e.addEventListener("focusout", this._onFocusOut.bind(this))),
        t.accessibleTitle && null !== t.accessibleTitle ? e.title = t.accessibleTitle : t.accessibleHint && null !== t.accessibleHint || (e.title = "displayObject " + t.tabIndex),
        t.accessibleHint && null !== t.accessibleHint && e.setAttribute("aria-label", t.accessibleHint),
        t._accessibleActive = !0,
        t._accessibleDiv = e,
        e.displayObject = t,
        this.children.push(t),
        this.div.appendChild(t._accessibleDiv),
        t._accessibleDiv.tabIndex = t.tabIndex
    }
    ,
    rr.prototype._onClick = function(t) {
        var e = this.renderer.plugins.interaction;
        e.dispatchEvent(t.target.displayObject, "click", e.eventData),
        e.dispatchEvent(t.target.displayObject, "pointertap", e.eventData),
        e.dispatchEvent(t.target.displayObject, "tap", e.eventData)
    }
    ,
    rr.prototype._onFocus = function(t) {
        t.target.getAttribute("aria-live", "off") || t.target.setAttribute("aria-live", "assertive");
        var e = this.renderer.plugins.interaction;
        e.dispatchEvent(t.target.displayObject, "mouseover", e.eventData)
    }
    ,
    rr.prototype._onFocusOut = function(t) {
        t.target.getAttribute("aria-live", "off") || t.target.setAttribute("aria-live", "polite");
        var e = this.renderer.plugins.interaction;
        e.dispatchEvent(t.target.displayObject, "mouseout", e.eventData)
    }
    ,
    rr.prototype._onKeyDown = function(t) {
        9 === t.keyCode && this.activate()
    }
    ,
    rr.prototype._onMouseMove = function(t) {
        0 === t.movementX && 0 === t.movementY || this.deactivate()
    }
    ,
    rr.prototype.destroy = function() {
        this.destroyTouchHook(),
        this.div = null;
        for (var t = 0; t < this.children.length; t++)
            this.children[t].div = null;
        window.document.removeEventListener("mousemove", this._onMouseMove, !0),
        window.removeEventListener("keydown", this._onKeyDown),
        this.pool = null,
        this.children = null,
        this.renderer = null
    }
    ;
    var nr = {
        AccessibilityManager: rr,
        accessibleTarget: ir
    }
      , or = function(t) {
        this.items = [],
        this._name = t,
        this._aliasCount = 0
    }
      , sr = {
        empty: {
            configurable: !0
        },
        name: {
            configurable: !0
        }
    };
    or.prototype.emit = function(t, e, i, r, n, o, s, a) {
        if (arguments.length > 8)
            throw new Error("max arguments reached");
        var h = this
          , u = h.name
          , l = h.items;
        this._aliasCount++;
        for (var c = 0, d = l.length; c < d; c++)
            l[c][u](t, e, i, r, n, o, s, a);
        return l === this.items && this._aliasCount--,
        this
    }
    ,
    or.prototype.ensureNonAliasedItems = function() {
        this._aliasCount > 0 && this.items.length > 1 && (this._aliasCount = 0,
        this.items = this.items.slice(0))
    }
    ,
    or.prototype.add = function(t) {
        return t[this._name] && (this.ensureNonAliasedItems(),
        this.remove(t),
        this.items.push(t)),
        this
    }
    ,
    or.prototype.remove = function(t) {
        var e = this.items.indexOf(t);
        return -1 !== e && (this.ensureNonAliasedItems(),
        this.items.splice(e, 1)),
        this
    }
    ,
    or.prototype.contains = function(t) {
        return -1 !== this.items.indexOf(t)
    }
    ,
    or.prototype.removeAll = function() {
        return this.ensureNonAliasedItems(),
        this.items.length = 0,
        this
    }
    ,
    or.prototype.destroy = function() {
        this.removeAll(),
        this.items = null,
        this._name = null
    }
    ,
    sr.empty.get = function() {
        return 0 === this.items.length
    }
    ,
    sr.name.get = function() {
        return this._name
    }
    ,
    Object.defineProperties(or.prototype, sr),
    or.prototype.dispatch = or.prototype.emit,
    or.prototype.run = or.prototype.emit,
    Ie.TARGET_FPMS = .06;
    var ar = {
        INTERACTION: 50,
        HIGH: 25,
        NORMAL: 0,
        LOW: -25,
        UTILITY: -50
    }
      , hr = function(t, e, i, r) {
        void 0 === e && (e = null),
        void 0 === i && (i = 0),
        void 0 === r && (r = !1),
        this.fn = t,
        this.context = e,
        this.priority = i,
        this.once = r,
        this.next = null,
        this.previous = null,
        this._destroyed = !1
    };
    hr.prototype.match = function(t, e) {
        return e = e || null,
        this.fn === t && this.context === e
    }
    ,
    hr.prototype.emit = function(t) {
        this.fn && (this.context ? this.fn.call(this.context, t) : this.fn(t));
        var e = this.next;
        return this.once && this.destroy(!0),
        this._destroyed && (this.next = null),
        e
    }
    ,
    hr.prototype.connect = function(t) {
        this.previous = t,
        t.next && (t.next.previous = this),
        this.next = t.next,
        t.next = this
    }
    ,
    hr.prototype.destroy = function(t) {
        void 0 === t && (t = !1),
        this._destroyed = !0,
        this.fn = null,
        this.context = null,
        this.previous && (this.previous.next = this.next),
        this.next && (this.next.previous = this.previous);
        var e = this.next;
        return this.next = t ? null : e,
        this.previous = null,
        e
    }
    ;
    var ur = function() {
        var t = this;
        this._head = new hr(null,null,1 / 0),
        this._requestId = null,
        this._maxElapsedMS = 100,
        this._minElapsedMS = 0,
        this.autoStart = !1,
        this.deltaTime = 1,
        this.deltaMS = 1 / Ie.TARGET_FPMS,
        this.elapsedMS = 1 / Ie.TARGET_FPMS,
        this.lastTime = -1,
        this.speed = 1,
        this.started = !1,
        this._protected = !1,
        this._lastFrame = -1,
        this._tick = function(e) {
            t._requestId = null,
            t.started && (t.update(e),
            t.started && null === t._requestId && t._head.next && (t._requestId = requestAnimationFrame(t._tick)))
        }
    }
      , lr = {
        FPS: {
            configurable: !0
        },
        minFPS: {
            configurable: !0
        },
        maxFPS: {
            configurable: !0
        }
    }
      , cr = {
        shared: {
            configurable: !0
        },
        system: {
            configurable: !0
        }
    };
    ur.prototype._requestIfNeeded = function() {
        null === this._requestId && this._head.next && (this.lastTime = performance.now(),
        this._lastFrame = this.lastTime,
        this._requestId = requestAnimationFrame(this._tick))
    }
    ,
    ur.prototype._cancelIfNeeded = function() {
        null !== this._requestId && (cancelAnimationFrame(this._requestId),
        this._requestId = null)
    }
    ,
    ur.prototype._startIfPossible = function() {
        this.started ? this._requestIfNeeded() : this.autoStart && this.start()
    }
    ,
    ur.prototype.add = function(t, e, i) {
        return void 0 === i && (i = ar.NORMAL),
        this._addListener(new hr(t,e,i))
    }
    ,
    ur.prototype.addOnce = function(t, e, i) {
        return void 0 === i && (i = ar.NORMAL),
        this._addListener(new hr(t,e,i,!0))
    }
    ,
    ur.prototype._addListener = function(t) {
        var e = this._head.next
          , i = this._head;
        if (e) {
            for (; e; ) {
                if (t.priority > e.priority) {
                    t.connect(i);
                    break
                }
                i = e,
                e = e.next
            }
            t.previous || t.connect(i)
        } else
            t.connect(i);
        return this._startIfPossible(),
        this
    }
    ,
    ur.prototype.remove = function(t, e) {
        for (var i = this._head.next; i; )
            i = i.match(t, e) ? i.destroy() : i.next;
        return this._head.next || this._cancelIfNeeded(),
        this
    }
    ,
    ur.prototype.start = function() {
        this.started || (this.started = !0,
        this._requestIfNeeded())
    }
    ,
    ur.prototype.stop = function() {
        this.started && (this.started = !1,
        this._cancelIfNeeded())
    }
    ,
    ur.prototype.destroy = function() {
        if (!this._protected) {
            this.stop();
            for (var t = this._head.next; t; )
                t = t.destroy(!0);
            this._head.destroy(),
            this._head = null
        }
    }
    ,
    ur.prototype.update = function(t) {
        void 0 === t && (t = performance.now());
        var e;
        if (t > this.lastTime) {
            if (e = this.elapsedMS = t - this.lastTime,
            e > this._maxElapsedMS && (e = this._maxElapsedMS),
            e *= this.speed,
            this._minElapsedMS) {
                var i = t - this._lastFrame | 0;
                if (i < this._minElapsedMS)
                    return;
                this._lastFrame = t - i % this._minElapsedMS
            }
            this.deltaMS = e,
            this.deltaTime = this.deltaMS * Ie.TARGET_FPMS;
            for (var r = this._head, n = r.next; n; )
                n = n.emit(this.deltaTime);
            r.next || this._cancelIfNeeded()
        } else
            this.deltaTime = this.deltaMS = this.elapsedMS = 0;
        this.lastTime = t
    }
    ,
    lr.FPS.get = function() {
        return 1e3 / this.elapsedMS
    }
    ,
    lr.minFPS.get = function() {
        return 1e3 / this._maxElapsedMS
    }
    ,
    lr.minFPS.set = function(t) {
        var e = Math.min(this.maxFPS, t)
          , i = Math.min(Math.max(0, e) / 1e3, Ie.TARGET_FPMS);
        this._maxElapsedMS = 1 / i
    }
    ,
    lr.maxFPS.get = function() {
        return this._minElapsedMS ? Math.round(1e3 / this._minElapsedMS) : 0
    }
    ,
    lr.maxFPS.set = function(t) {
        if (0 === t)
            this._minElapsedMS = 0;
        else {
            var e = Math.max(this.minFPS, t);
            this._minElapsedMS = 1 / (e / 1e3)
        }
    }
    ,
    cr.shared.get = function() {
        if (!ur._shared) {
            var t = ur._shared = new ur;
            t.autoStart = !0,
            t._protected = !0
        }
        return ur._shared
    }
    ,
    cr.system.get = function() {
        if (!ur._system) {
            var t = ur._system = new ur;
            t.autoStart = !0,
            t._protected = !0
        }
        return ur._system
    }
    ,
    Object.defineProperties(ur.prototype, lr),
    Object.defineProperties(ur, cr);
    var dr = function() {};
    dr.init = function(t) {
        var e = this;
        t = Object.assign({
            autoStart: !0,
            sharedTicker: !1
        }, t),
        Object.defineProperty(this, "ticker", {
            set: function(t) {
                this._ticker && this._ticker.remove(this.render, this),
                this._ticker = t,
                t && t.add(this.render, this, ar.LOW)
            },
            get: function() {
                return this._ticker
            }
        }),
        this.stop = function() {
            e._ticker.stop()
        }
        ,
        this.start = function() {
            e._ticker.start()
        }
        ,
        this._ticker = null,
        this.ticker = t.sharedTicker ? ur.shared : new ur,
        t.autoStart && this.start()
    }
    ,
    dr.destroy = function() {
        if (this._ticker) {
            var t = this._ticker;
            this.ticker = null,
            t.destroy()
        }
    }
    ;
    var pr = function(t, e) {
        void 0 === t && (t = 0),
        void 0 === e && (e = 0),
        this._width = t,
        this._height = e,
        this.destroyed = !1,
        this.internal = !1,
        this.onResize = new or("setRealSize",2),
        this.onUpdate = new or("update"),
        this.onError = new or("onError",1)
    }
      , fr = {
        valid: {
            configurable: !0
        },
        width: {
            configurable: !0
        },
        height: {
            configurable: !0
        }
    };
    pr.prototype.bind = function(t) {
        this.onResize.add(t),
        this.onUpdate.add(t),
        this.onError.add(t),
        (this._width || this._height) && this.onResize.run(this._width, this._height)
    }
    ,
    pr.prototype.unbind = function(t) {
        this.onResize.remove(t),
        this.onUpdate.remove(t),
        this.onError.remove(t)
    }
    ,
    pr.prototype.resize = function(t, e) {
        t === this._width && e === this._height || (this._width = t,
        this._height = e,
        this.onResize.run(t, e))
    }
    ,
    fr.valid.get = function() {
        return !!this._width && !!this._height
    }
    ,
    pr.prototype.update = function() {
        this.destroyed || this.onUpdate.run()
    }
    ,
    pr.prototype.load = function() {
        return Promise.resolve()
    }
    ,
    fr.width.get = function() {
        return this._width
    }
    ,
    fr.height.get = function() {
        return this._height
    }
    ,
    pr.prototype.upload = function(t, e, i) {
        return !1
    }
    ,
    pr.prototype.style = function(t, e, i) {
        return !1
    }
    ,
    pr.prototype.dispose = function() {}
    ,
    pr.prototype.destroy = function() {
        this.destroyed || (this.destroyed = !0,
        this.dispose(),
        this.onError.removeAll(),
        this.onError = null,
        this.onResize.removeAll(),
        this.onResize = null,
        this.onUpdate.removeAll(),
        this.onUpdate = null)
    }
    ,
    Object.defineProperties(pr.prototype, fr);
    var vr = function(t) {
        function e(e) {
            var i = e.naturalWidth || e.videoWidth || e.width
              , r = e.naturalHeight || e.videoHeight || e.height;
            t.call(this, i, r),
            this.source = e,
            this.noSubImage = !1
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.crossOrigin = function(t, e, i) {
            void 0 === i && 0 !== e.indexOf("data:") ? t.crossOrigin = ut(e) : !1 !== i && (t.crossOrigin = "string" == typeof i ? i : "anonymous")
        }
        ,
        e.prototype.upload = function(t, e, i, r) {
            var n = t.gl
              , o = e.realWidth
              , s = e.realHeight;
            return r = r || this.source,
            n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.premultiplyAlpha),
            this.noSubImage || e.target !== n.TEXTURE_2D || i.width !== o || i.height !== s ? (i.width = o,
            i.height = s,
            n.texImage2D(e.target, 0, e.format, e.format, e.type, r)) : n.texSubImage2D(n.TEXTURE_2D, 0, 0, 0, e.format, e.type, r),
            !0
        }
        ,
        e.prototype.update = function() {
            if (!this.destroyed) {
                var e = this.source.naturalWidth || this.source.videoWidth || this.source.width
                  , i = this.source.naturalHeight || this.source.videoHeight || this.source.height;
                this.resize(e, i),
                t.prototype.update.call(this)
            }
        }
        ,
        e.prototype.dispose = function() {
            this.source = null
        }
        ,
        e
    }(pr)
      , gr = function(t) {
        function e(e, i) {
            if (i = i || {},
            !(e instanceof HTMLImageElement)) {
                var r = new Image;
                t.crossOrigin(r, e, i.crossorigin),
                r.src = e,
                e = r
            }
            t.call(this, e),
            !e.complete && this._width && this._height && (this._width = 0,
            this._height = 0),
            this.url = e.src,
            this._process = null,
            this.preserveBitmap = !1,
            this.createBitmap = (void 0 !== i.createBitmap ? i.createBitmap : Ie.CREATE_IMAGE_BITMAP) && !!window.createImageBitmap,
            this.premultiplyAlpha = !1 !== i.premultiplyAlpha,
            this.bitmap = null,
            this._load = null,
            !1 !== i.autoLoad && this.load()
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.load = function(t) {
            var e = this;
            return void 0 !== t && (this.createBitmap = t),
            this._load ? this._load : (this._load = new Promise(function(t) {
                e.url = e.source.src;
                var i = e
                  , r = i.source
                  , n = function() {
                    e.destroyed || (r.onload = null,
                    r.onerror = null,
                    e.resize(r.width, r.height),
                    e._load = null,
                    t(e.createBitmap ? e.process() : e))
                };
                r.complete && r.src ? n() : (r.onload = n,
                r.onerror = function(t) {
                    return e.onError.run(t)
                }
                )
            }
            ),
            this._load)
        }
        ,
        e.prototype.process = function() {
            var t = this;
            return null !== this._process ? this._process : null === this.bitmap && window.createImageBitmap ? (this._process = window.createImageBitmap(this.source, 0, 0, this.source.width, this.source.height, {
                premultiplyAlpha: this.premultiplyAlpha ? "premultiply" : "none"
            }).then(function(e) {
                return t.destroyed ? Promise.reject() : (t.bitmap = e,
                t.update(),
                t._process = null,
                Promise.resolve(t))
            }),
            this._process) : Promise.resolve(this)
        }
        ,
        e.prototype.upload = function(e, i, r) {
            if (i.premultiplyAlpha = this.premultiplyAlpha,
            !this.createBitmap)
                return t.prototype.upload.call(this, e, i, r);
            if (!this.bitmap && (this.process(),
            !this.bitmap))
                return !1;
            if (t.prototype.upload.call(this, e, i, r, this.bitmap),
            !this.preserveBitmap) {
                var n = !0;
                for (var o in i._glTextures) {
                    var s = i._glTextures[o];
                    if (s !== r && s.dirtyId !== i.dirtyId) {
                        n = !1;
                        break
                    }
                }
                n && (this.bitmap.close && this.bitmap.close(),
                this.bitmap = null)
            }
            return !0
        }
        ,
        e.prototype.dispose = function() {
            this.source.onload = null,
            this.source.onerror = null,
            t.prototype.dispose.call(this),
            this.bitmap && (this.bitmap.close(),
            this.bitmap = null),
            this._process = null,
            this._load = null
        }
        ,
        e
    }(vr)
      , mr = []
      , yr = function(t) {
        function e(e, i) {
            var r = i || {}
              , n = r.width
              , o = r.height;
            if (!n || !o)
                throw new Error("BufferResource width or height invalid");
            t.call(this, n, o),
            this.data = e
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.upload = function(t, e, i) {
            var r = t.gl;
            return r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.premultiplyAlpha),
            i.width === e.width && i.height === e.height ? r.texSubImage2D(e.target, 0, 0, 0, e.width, e.height, e.format, e.type, this.data) : (i.width = e.width,
            i.height = e.height,
            r.texImage2D(e.target, 0, i.internalFormat, e.width, e.height, 0, e.format, i.type, this.data)),
            !0
        }
        ,
        e.prototype.dispose = function() {
            this.data = null
        }
        ,
        e.test = function(t) {
            return t instanceof Float32Array || t instanceof Uint8Array || t instanceof Uint32Array
        }
        ,
        e
    }(pr)
      , _r = {
        scaleMode: hi.NEAREST,
        format: oi.RGBA,
        premultiplyAlpha: !1
    }
      , xr = function(t) {
        function e(e, i) {
            void 0 === e && (e = null),
            void 0 === i && (i = null),
            t.call(this),
            i = i || {};
            var r = i.premultiplyAlpha
              , n = i.mipmap
              , o = i.anisotropicLevel
              , s = i.scaleMode
              , a = i.width
              , h = i.height
              , u = i.wrapMode
              , l = i.format
              , c = i.type
              , d = i.target
              , p = i.resolution
              , f = i.resourceOptions;
            !e || e instanceof pr || (e = pt(e, f),
            e.internal = !0),
            this.width = a || 0,
            this.height = h || 0,
            this.resolution = p || Ie.RESOLUTION,
            this.mipmap = void 0 !== n ? n : Ie.MIPMAP_TEXTURES,
            this.anisotropicLevel = void 0 !== o ? o : Ie.ANISOTROPIC_LEVEL,
            this.wrapMode = u || Ie.WRAP_MODE,
            this.scaleMode = void 0 !== s ? s : Ie.SCALE_MODE,
            this.format = l || oi.RGBA,
            this.type = c || ai.UNSIGNED_BYTE,
            this.target = d || si.TEXTURE_2D,
            this.premultiplyAlpha = !1 !== r,
            this.uid = tt(),
            this.touched = 0,
            this.isPowerOfTwo = !1,
            this._refreshPOT(),
            this._glTextures = {},
            this.dirtyId = 0,
            this.dirtyStyleId = 0,
            this.cacheId = null,
            this.valid = a > 0 && h > 0,
            this.textureCacheIds = [],
            this.destroyed = !1,
            this.resource = null,
            this._batchEnabled = 0,
            this.setResource(e)
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            realWidth: {
                configurable: !0
            },
            realHeight: {
                configurable: !0
            }
        };
        return i.realWidth.get = function() {
            return Math.ceil(this.width * this.resolution - 1e-4)
        }
        ,
        i.realHeight.get = function() {
            return Math.ceil(this.height * this.resolution - 1e-4)
        }
        ,
        e.prototype.setStyle = function(t, e) {
            var i;
            return void 0 !== t && t !== this.scaleMode && (this.scaleMode = t,
            i = !0),
            void 0 !== e && e !== this.mipmap && (this.mipmap = e,
            i = !0),
            i && this.dirtyStyleId++,
            this
        }
        ,
        e.prototype.setSize = function(t, e, i) {
            return this.resolution = i || this.resolution,
            this.width = t,
            this.height = e,
            this._refreshPOT(),
            this.update(),
            this
        }
        ,
        e.prototype.setRealSize = function(t, e, i) {
            return this.resolution = i || this.resolution,
            this.width = t / this.resolution,
            this.height = e / this.resolution,
            this._refreshPOT(),
            this.update(),
            this
        }
        ,
        e.prototype._refreshPOT = function() {
            this.isPowerOfTwo = rt(this.realWidth) && rt(this.realHeight)
        }
        ,
        e.prototype.setResolution = function(t) {
            var e = this.resolution;
            return e === t ? this : (this.resolution = t,
            this.valid && (this.width = this.width * e / t,
            this.height = this.height * e / t,
            this.emit("update", this)),
            this._refreshPOT(),
            this)
        }
        ,
        e.prototype.setResource = function(t) {
            if (this.resource === t)
                return this;
            if (this.resource)
                throw new Error("Resource can be set only once");
            return t.bind(this),
            this.resource = t,
            this
        }
        ,
        e.prototype.update = function() {
            this.valid ? (this.dirtyId++,
            this.dirtyStyleId++,
            this.emit("update", this)) : this.width > 0 && this.height > 0 && (this.valid = !0,
            this.emit("loaded", this),
            this.emit("update", this))
        }
        ,
        e.prototype.onError = function(t) {
            this.emit("error", this, t)
        }
        ,
        e.prototype.destroy = function() {
            this.resource && (this.resource.unbind(this),
            this.resource.internal && this.resource.destroy(),
            this.resource = null),
            this.cacheId && (delete xi[this.cacheId],
            delete _i[this.cacheId],
            this.cacheId = null),
            this.dispose(),
            e.removeFromCache(this),
            this.textureCacheIds = null,
            this.destroyed = !0
        }
        ,
        e.prototype.dispose = function() {
            this.emit("dispose", this)
        }
        ,
        e.from = function(t, i) {
            var r = null;
            "string" == typeof t ? r = t : (t._pixiId || (t._pixiId = "pixiid_" + tt()),
            r = t._pixiId);
            var n = xi[r];
            return n || (n = new e(t,i),
            n.cacheId = r,
            e.addToCache(n, r)),
            n
        }
        ,
        e.fromBuffer = function(t, i, r, n) {
            t = t || new Float32Array(i * r * 4);
            var o = new yr(t,{
                width: i,
                height: r
            })
              , s = t instanceof Float32Array ? ai.FLOAT : ai.UNSIGNED_BYTE;
            return new e(o,Object.assign(_r, n || {
                width: i,
                height: r,
                type: s
            }))
        }
        ,
        e.addToCache = function(t, e) {
            e && (-1 === t.textureCacheIds.indexOf(e) && t.textureCacheIds.push(e),
            xi[e] && console.warn("BaseTexture added to the cache with an id [" + e + "] that already had an entry"),
            xi[e] = t)
        }
        ,
        e.removeFromCache = function(t) {
            if ("string" == typeof t) {
                var e = xi[t];
                if (e) {
                    var i = e.textureCacheIds.indexOf(t);
                    return i > -1 && e.textureCacheIds.splice(i, 1),
                    delete xi[t],
                    e
                }
            } else if (t && t.textureCacheIds) {
                for (var r = 0; r < t.textureCacheIds.length; ++r)
                    delete xi[t.textureCacheIds[r]];
                return t.textureCacheIds.length = 0,
                t
            }
            return null
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Pe);
    xr._globalBatch = 0;
    var br = function(t) {
        function e(e, i) {
            i = i || {};
            var r, n = e;
            Array.isArray(e) && (r = e,
            n = e.length),
            t.call(this, i.width, i.height),
            this.items = [],
            this.itemDirtyIds = [];
            for (var o = 0; o < n; o++) {
                var s = new xr;
                this.items.push(s),
                this.itemDirtyIds.push(-1)
            }
            if (this.length = n,
            this._load = null,
            r)
                for (var a = 0; a < n; a++)
                    this.addResourceAt(pt(r[a], i), a)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.dispose = function() {
            for (var t = 0, e = this.length; t < e; t++)
                this.items[t].destroy();
            this.items = null,
            this.itemDirtyIds = null,
            this._load = null
        }
        ,
        e.prototype.addResourceAt = function(t, e) {
            if (!this.items[e])
                throw new Error("Index " + e + " is out of bounds");
            return t.valid && !this.valid && this.resize(t.width, t.height),
            this.items[e].setResource(t),
            this
        }
        ,
        e.prototype.bind = function(e) {
            t.prototype.bind.call(this, e),
            e.target = si.TEXTURE_2D_ARRAY;
            for (var i = 0; i < this.length; i++)
                this.items[i].on("update", e.update, e)
        }
        ,
        e.prototype.unbind = function(e) {
            t.prototype.unbind.call(this, e);
            for (var i = 0; i < this.length; i++)
                this.items[i].off("update", e.update, e)
        }
        ,
        e.prototype.load = function() {
            var t = this;
            if (this._load)
                return this._load;
            var e = this.items.map(function(t) {
                return t.resource
            })
              , i = e.map(function(t) {
                return t.load()
            });
            return this._load = Promise.all(i).then(function() {
                var i = e[0]
                  , r = i.width
                  , n = i.height;
                return t.resize(r, n),
                Promise.resolve(t)
            }),
            this._load
        }
        ,
        e.prototype.upload = function(t, e, i) {
            var r = this
              , n = r.length
              , o = r.itemDirtyIds
              , s = r.items
              , a = t.gl;
            i.dirtyId < 0 && a.texImage3D(a.TEXTURE_2D_ARRAY, 0, e.format, this._width, this._height, n, 0, e.format, e.type, null);
            for (var h = 0; h < n; h++) {
                var u = s[h];
                o[h] < u.dirtyId && (o[h] = u.dirtyId,
                u.valid && a.texSubImage3D(a.TEXTURE_2D_ARRAY, 0, 0, 0, h, u.resource.width, u.resource.height, 1, e.format, e.type, u.resource.source))
            }
            return !0
        }
        ,
        e
    }(pr)
      , Tr = function(t) {
        function e() {
            t.apply(this, arguments)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.test = function(t) {
            var e = window.OffscreenCanvas;
            return !!(e && t instanceof e) || t instanceof HTMLCanvasElement
        }
        ,
        e
    }(vr)
      , wr = function(t) {
        function e(i, r) {
            if (r = r || {},
            t.call(this, i, r),
            this.length !== e.SIDES)
                throw new Error("Invalid length. Got " + this.length + ", expected 6");
            for (var n = 0; n < e.SIDES; n++)
                this.items[n].target = si.TEXTURE_CUBE_MAP_POSITIVE_X + n;
            !1 !== r.autoLoad && this.load()
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.bind = function(e) {
            t.prototype.bind.call(this, e),
            e.target = si.TEXTURE_CUBE_MAP
        }
        ,
        e.prototype.upload = function(t, i, r) {
            for (var n = this.itemDirtyIds, o = 0; o < e.SIDES; o++) {
                var s = this.items[o];
                n[o] < s.dirtyId && (n[o] = s.dirtyId,
                s.valid && s.resource.upload(t, s, r))
            }
            return !0
        }
        ,
        e
    }(br);
    wr.SIDES = 6;
    var Er = function(t) {
        function e(e, i) {
            i = i || {},
            t.call(this, document.createElement("canvas")),
            this._width = 0,
            this._height = 0,
            this.svg = e,
            this.scale = i.scale || 1,
            this._overrideWidth = i.width,
            this._overrideHeight = i.height,
            this._resolve = null,
            this._crossorigin = i.crossorigin,
            this._load = null,
            !1 !== i.autoLoad && this.load()
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.load = function() {
            var t = this;
            return this._load ? this._load : (this._load = new Promise(function(e) {
                if (t._resolve = function() {
                    t.resize(t.source.width, t.source.height),
                    e(t)
                }
                ,
                /^\<svg/.test(t.svg.trim())) {
                    if (!btoa)
                        throw new Error("Your browser doesn't support base64 conversions.");
                    t.svg = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(t.svg)))
                }
                t._loadSvg()
            }
            ),
            this._load)
        }
        ,
        e.prototype._loadSvg = function() {
            var e = this
              , i = new Image;
            t.crossOrigin(i, this.svg, this._crossorigin),
            i.src = this.svg,
            i.onerror = function(t) {
                i.onerror = null,
                e.onError.run(t)
            }
            ,
            i.onload = function() {
                var t = i.width
                  , r = i.height;
                if (!t || !r)
                    throw new Error("The SVG image must have width and height defined (in pixels), canvas API needs them.");
                var n = t * e.scale
                  , o = r * e.scale;
                (e._overrideWidth || e._overrideHeight) && (n = e._overrideWidth || e._overrideHeight / r * t,
                o = e._overrideHeight || e._overrideWidth / t * r),
                n = Math.round(n),
                o = Math.round(o);
                var s = e.source;
                s.width = n,
                s.height = o,
                s._pixiId = "canvas_" + tt(),
                s.getContext("2d").drawImage(i, 0, 0, t, r, 0, 0, n, o),
                e._resolve(),
                e._resolve = null
            }
        }
        ,
        e.getSize = function(t) {
            var i = e.SVG_SIZE.exec(t)
              , r = {};
            return i && (r[i[1]] = Math.round(parseFloat(i[3])),
            r[i[5]] = Math.round(parseFloat(i[7]))),
            r
        }
        ,
        e.prototype.dispose = function() {
            t.prototype.dispose.call(this),
            this._resolve = null,
            this._crossorigin = null
        }
        ,
        e.test = function(t, e) {
            return "svg" === e || "string" == typeof t && 0 === t.indexOf("data:image/svg+xml;base64") || "string" == typeof t && 0 === t.indexOf("<svg")
        }
        ,
        e
    }(vr);
    Er.SVG_SIZE = /<svg[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*(?:\s(width|height)=('|")(\d*(?:\.\d+)?)(?:px)?('|"))[^>]*>/i;
    var Sr = function(t) {
        function e(e, i) {
            if (i = i || {},
            !(e instanceof HTMLVideoElement)) {
                var r = document.createElement("video");
                r.setAttribute("preload", "auto"),
                r.setAttribute("webkit-playsinline", ""),
                r.setAttribute("playsinline", ""),
                "string" == typeof e && (e = [e]),
                t.crossOrigin(r, e[0].src || e[0], i.crossorigin);
                for (var n = 0; n < e.length; ++n) {
                    var o = document.createElement("source")
                      , s = e[n]
                      , a = s.src
                      , h = s.mime;
                    a = a || e[n];
                    var u = a.split("?").shift().toLowerCase()
                      , l = u.substr(u.lastIndexOf(".") + 1);
                    h = h || "video/" + l,
                    o.src = a,
                    o.type = h,
                    r.appendChild(o)
                }
                e = r
            }
            t.call(this, e),
            this.noSubImage = !0,
            this._autoUpdate = !0,
            this._isAutoUpdating = !1,
            this._updateFPS = i.updateFPS || 0,
            this._msToNextUpdate = 0,
            this.autoPlay = !1 !== i.autoPlay,
            this._load = null,
            this._resolve = null,
            this._onCanPlay = this._onCanPlay.bind(this),
            this._onError = this._onError.bind(this),
            !1 !== i.autoLoad && this.load()
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            autoUpdate: {
                configurable: !0
            },
            updateFPS: {
                configurable: !0
            }
        };
        return e.prototype.update = function(e) {
            if (void 0 === e && (e = 0),
            !this.destroyed) {
                var i = ur.shared.elapsedMS * this.source.playbackRate;
                this._msToNextUpdate = Math.floor(this._msToNextUpdate - i),
                (!this._updateFPS || this._msToNextUpdate <= 0) && (t.prototype.update.call(this, e),
                this._msToNextUpdate = this._updateFPS ? Math.floor(1e3 / this._updateFPS) : 0)
            }
        }
        ,
        e.prototype.load = function() {
            var t = this;
            if (this._load)
                return this._load;
            var e = this.source;
            return (e.readyState === e.HAVE_ENOUGH_DATA || e.readyState === e.HAVE_FUTURE_DATA) && e.width && e.height && (e.complete = !0),
            e.addEventListener("play", this._onPlayStart.bind(this)),
            e.addEventListener("pause", this._onPlayStop.bind(this)),
            this._isSourceReady() ? this._onCanPlay() : (e.addEventListener("canplay", this._onCanPlay),
            e.addEventListener("canplaythrough", this._onCanPlay),
            e.addEventListener("error", this._onError, !0)),
            this._load = new Promise(function(i) {
                t.valid ? i(t) : (t._resolve = i,
                e.load())
            }
            ),
            this._load
        }
        ,
        e.prototype._onError = function() {
            this.source.removeEventListener("error", this._onError, !0),
            this.onError.run(event)
        }
        ,
        e.prototype._isSourcePlaying = function() {
            var t = this.source;
            return t.currentTime > 0 && !1 === t.paused && !1 === t.ended && t.readyState > 2
        }
        ,
        e.prototype._isSourceReady = function() {
            return 3 === this.source.readyState || 4 === this.source.readyState
        }
        ,
        e.prototype._onPlayStart = function() {
            this.valid || this._onCanPlay(),
            !this._isAutoUpdating && this.autoUpdate && (ur.shared.add(this.update, this),
            this._isAutoUpdating = !0)
        }
        ,
        e.prototype._onPlayStop = function() {
            this._isAutoUpdating && (ur.shared.remove(this.update, this),
            this._isAutoUpdating = !1)
        }
        ,
        e.prototype._onCanPlay = function() {
            var t = this
              , e = t.source;
            e.removeEventListener("canplay", this._onCanPlay),
            e.removeEventListener("canplaythrough", this._onCanPlay);
            var i = this.valid;
            this.resize(e.videoWidth, e.videoHeight),
            !i && this._resolve && (this._resolve(this),
            this._resolve = null),
            this._isSourcePlaying() ? this._onPlayStart() : this.autoPlay && e.play()
        }
        ,
        e.prototype.dispose = function() {
            this._isAutoUpdating && ur.shared.remove(this.update, this),
            this.source && (this.source.removeEventListener("error", this._onError, !0),
            this.source.pause(),
            this.source.src = "",
            this.source.load()),
            t.prototype.dispose.call(this)
        }
        ,
        i.autoUpdate.get = function() {
            return this._autoUpdate
        }
        ,
        i.autoUpdate.set = function(t) {
            t !== this._autoUpdate && (this._autoUpdate = t,
            !this._autoUpdate && this._isAutoUpdating ? (ur.shared.remove(this.update, this),
            this._isAutoUpdating = !1) : this._autoUpdate && !this._isAutoUpdating && (ur.shared.add(this.update, this),
            this._isAutoUpdating = !0))
        }
        ,
        i.updateFPS.get = function() {
            return this._updateFPS
        }
        ,
        i.updateFPS.set = function(t) {
            t !== this._updateFPS && (this._updateFPS = t)
        }
        ,
        e.test = function(t, i) {
            return t instanceof HTMLVideoElement || e.TYPES.indexOf(i) > -1
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(vr);
    Sr.TYPES = ["mp4", "m4v", "webm", "ogg", "ogv", "h264", "avi", "mov"];
    var Ir = function(t) {
        function e() {
            t.apply(this, arguments)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.test = function(t) {
            return !!window.createImageBitmap && t instanceof ImageBitmap
        }
        ,
        e
    }(vr);
    mr.push(gr, Ir, Tr, Sr, Er, yr, wr, br);
    var Pr = {
        INSTALLED: mr,
        autoDetectResource: pt,
        ArrayResource: br,
        BufferResource: yr,
        CanvasResource: Tr,
        CubeResource: wr,
        ImageResource: gr,
        ImageBitmapResource: Ir,
        SVGResource: Er,
        VideoResource: Sr,
        Resource: pr,
        BaseImageResource: vr
    }
      , Ar = function(t) {
        this.renderer = t
    };
    Ar.prototype.destroy = function() {
        this.renderer = null
    }
    ;
    var Or = function(t) {
        function e() {
            t.apply(this, arguments)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.upload = function(t, e, i) {
            var r = t.gl;
            return r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL, e.premultiplyAlpha),
            i.width === e.width && i.height === e.height ? r.texSubImage2D(e.target, 0, 0, 0, e.width, e.height, e.format, e.type, this.data) : (i.width = e.width,
            i.height = e.height,
            r.texImage2D(e.target, 0, r.DEPTH_COMPONENT16, e.width, e.height, 0, e.format, e.type, this.data)),
            !0
        }
        ,
        e
    }(yr)
      , Cr = function(t, e) {
        this.width = Math.ceil(t || 100),
        this.height = Math.ceil(e || 100),
        this.stencil = !1,
        this.depth = !1,
        this.dirtyId = 0,
        this.dirtyFormat = 0,
        this.dirtySize = 0,
        this.depthTexture = null,
        this.colorTextures = [],
        this.glFramebuffers = {},
        this.disposeRunner = new or("disposeFramebuffer",2)
    }
      , Mr = {
        colorTexture: {
            configurable: !0
        }
    };
    Mr.colorTexture.get = function() {
        return this.colorTextures[0]
    }
    ,
    Cr.prototype.addColorTexture = function(t, e) {
        return void 0 === t && (t = 0),
        this.colorTextures[t] = e || new xr(null,{
            scaleMode: 0,
            resolution: 1,
            mipmap: !1,
            width: this.width,
            height: this.height
        }),
        this.dirtyId++,
        this.dirtyFormat++,
        this
    }
    ,
    Cr.prototype.addDepthTexture = function(t) {
        return this.depthTexture = t || new xr(new Or(null,{
            width: this.width,
            height: this.height
        }),{
            scaleMode: 0,
            resolution: 1,
            width: this.width,
            height: this.height,
            mipmap: !1,
            format: oi.DEPTH_COMPONENT,
            type: ai.UNSIGNED_SHORT
        }),
        this.dirtyId++,
        this.dirtyFormat++,
        this
    }
    ,
    Cr.prototype.enableDepth = function() {
        return this.depth = !0,
        this.dirtyId++,
        this.dirtyFormat++,
        this
    }
    ,
    Cr.prototype.enableStencil = function() {
        return this.stencil = !0,
        this.dirtyId++,
        this.dirtyFormat++,
        this
    }
    ,
    Cr.prototype.resize = function(t, e) {
        if (t = Math.ceil(t),
        e = Math.ceil(e),
        t !== this.width || e !== this.height) {
            this.width = t,
            this.height = e,
            this.dirtyId++,
            this.dirtySize++;
            for (var i = 0; i < this.colorTextures.length; i++) {
                var r = this.colorTextures[i]
                  , n = r.resolution;
                r.setSize(t / n, e / n)
            }
            if (this.depthTexture) {
                var o = this.depthTexture.resolution;
                this.depthTexture.setSize(t / o, e / o)
            }
        }
    }
    ,
    Cr.prototype.dispose = function() {
        this.disposeRunner.run(this, !1)
    }
    ,
    Object.defineProperties(Cr.prototype, Mr);
    var Dr = function(t) {
        function e(e) {
            if ("number" == typeof e) {
                e = {
                    width: arguments[0],
                    height: arguments[1],
                    scaleMode: arguments[2],
                    resolution: arguments[3]
                }
            }
            t.call(this, null, e);
            var i = e || {}
              , r = i.width
              , n = i.height;
            this.mipmap = !1,
            this.width = Math.ceil(r) || 100,
            this.height = Math.ceil(n) || 100,
            this.valid = !0,
            this._canvasRenderTarget = null,
            this.clearColor = [0, 0, 0, 0],
            this.framebuffer = new Cr(this.width * this.resolution,this.height * this.resolution).addColorTexture(0, this),
            this.stencilMaskStack = [],
            this.filterStack = [{}]
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.resize = function(t, e) {
            t = Math.ceil(t),
            e = Math.ceil(e),
            this.framebuffer.resize(t * this.resolution, e * this.resolution)
        }
        ,
        e.prototype.dispose = function() {
            this.framebuffer.dispose(),
            t.prototype.dispose.call(this)
        }
        ,
        e.prototype.destroy = function() {
            t.prototype.destroy.call(this, !0),
            this.framebuffer = null
        }
        ,
        e
    }(xr)
      , Rr = function() {
        this.x0 = 0,
        this.y0 = 0,
        this.x1 = 1,
        this.y1 = 0,
        this.x2 = 1,
        this.y2 = 1,
        this.x3 = 0,
        this.y3 = 1,
        this.uvsFloat32 = new Float32Array(8)
    };
    Rr.prototype.set = function(t, e, i) {
        var r = e.width
          , n = e.height;
        if (i) {
            var o = t.width / 2 / r
              , s = t.height / 2 / n
              , a = t.x / r + o
              , h = t.y / n + s;
            i = Hi.add(i, Hi.NW),
            this.x0 = a + o * Hi.uX(i),
            this.y0 = h + s * Hi.uY(i),
            i = Hi.add(i, 2),
            this.x1 = a + o * Hi.uX(i),
            this.y1 = h + s * Hi.uY(i),
            i = Hi.add(i, 2),
            this.x2 = a + o * Hi.uX(i),
            this.y2 = h + s * Hi.uY(i),
            i = Hi.add(i, 2),
            this.x3 = a + o * Hi.uX(i),
            this.y3 = h + s * Hi.uY(i)
        } else
            this.x0 = t.x / r,
            this.y0 = t.y / n,
            this.x1 = (t.x + t.width) / r,
            this.y1 = t.y / n,
            this.x2 = (t.x + t.width) / r,
            this.y2 = (t.y + t.height) / n,
            this.x3 = t.x / r,
            this.y3 = (t.y + t.height) / n;
        this.uvsFloat32[0] = this.x0,
        this.uvsFloat32[1] = this.y0,
        this.uvsFloat32[2] = this.x1,
        this.uvsFloat32[3] = this.y1,
        this.uvsFloat32[4] = this.x2,
        this.uvsFloat32[5] = this.y2,
        this.uvsFloat32[6] = this.x3,
        this.uvsFloat32[7] = this.y3
    }
    ;
    var Fr = new Rr
      , Lr = function(t) {
        function e(i, r, n, o, s, a) {
            if (t.call(this),
            this.noFrame = !1,
            r || (this.noFrame = !0,
            r = new Yi(0,0,1,1)),
            i instanceof e && (i = i.baseTexture),
            this.baseTexture = i,
            this._frame = r,
            this.trim = o,
            this.valid = !1,
            this.requiresUpdate = !1,
            this._uvs = Fr,
            this.uvMatrix = null,
            this.orig = n || r,
            this._rotate = Number(s || 0),
            !0 === s)
                this._rotate = 2;
            else if (this._rotate % 2 != 0)
                throw new Error("attempt to use diamond-shaped UVs. If you are sure, set rotation manually");
            this.defaultAnchor = a ? new Pi(a.x,a.y) : new Pi(0,0),
            this._updateID = 0,
            this.textureCacheIds = [],
            i.valid ? this.noFrame ? i.valid && this.onBaseTextureUpdated(i) : this.frame = r : i.once("loaded", this.onBaseTextureUpdated, this),
            this.noFrame && i.on("update", this.onBaseTextureUpdated, this)
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            resolution: {
                configurable: !0
            },
            frame: {
                configurable: !0
            },
            rotate: {
                configurable: !0
            },
            width: {
                configurable: !0
            },
            height: {
                configurable: !0
            }
        };
        return e.prototype.update = function() {
            this.baseTexture.resource && this.baseTexture.resource.update()
        }
        ,
        e.prototype.onBaseTextureUpdated = function(t) {
            if (this.noFrame) {
                if (!this.baseTexture.valid)
                    return;
                this._frame.width = t.width,
                this._frame.height = t.height,
                this.valid = !0,
                this.updateUvs()
            } else
                this.frame = this._frame;
            this.emit("update", this)
        }
        ,
        e.prototype.destroy = function(t) {
            if (this.baseTexture) {
                if (t) {
                    var i = this.baseTexture
                      , r = i.resource;
                    r && _i[r.url] && e.removeFromCache(r.url),
                    this.baseTexture.destroy()
                }
                this.baseTexture.off("update", this.onBaseTextureUpdated, this),
                this.baseTexture = null
            }
            this._frame = null,
            this._uvs = null,
            this.trim = null,
            this.orig = null,
            this.valid = !1,
            e.removeFromCache(this),
            this.textureCacheIds = null
        }
        ,
        e.prototype.clone = function() {
            return new e(this.baseTexture,this.frame,this.orig,this.trim,this.rotate,this.defaultAnchor)
        }
        ,
        e.prototype.updateUvs = function() {
            this._uvs === Fr && (this._uvs = new Rr),
            this._uvs.set(this._frame, this.baseTexture, this.rotate),
            this._updateID++
        }
        ,
        e.from = function(t, i) {
            void 0 === i && (i = {});
            var r = null;
            "string" == typeof t ? r = t : (t._pixiId || (t._pixiId = "pixiid_" + tt()),
            r = t._pixiId);
            var n = _i[r];
            return n || (i.resolution || (i.resolution = lt(t)),
            n = new e(new xr(t,i)),
            n.baseTexture.cacheId = r,
            xr.addToCache(n.baseTexture, r),
            e.addToCache(n, r)),
            n
        }
        ,
        e.fromBuffer = function(t, i, r, n) {
            return new e(xr.fromBuffer(t, i, r, n))
        }
        ,
        e.fromLoader = function(t, i, r) {
            var n = new gr(t);
            n.url = i;
            var o = new xr(n,{
                scaleMode: Ie.SCALE_MODE,
                resolution: lt(i)
            })
              , s = new e(o);
            return r || (r = i),
            xr.addToCache(s.baseTexture, r),
            e.addToCache(s, r),
            r !== i && (xr.addToCache(s.baseTexture, i),
            e.addToCache(s, i)),
            s
        }
        ,
        e.addToCache = function(t, e) {
            e && (-1 === t.textureCacheIds.indexOf(e) && t.textureCacheIds.push(e),
            _i[e] && console.warn("Texture added to the cache with an id [" + e + "] that already had an entry"),
            _i[e] = t)
        }
        ,
        e.removeFromCache = function(t) {
            if ("string" == typeof t) {
                var e = _i[t];
                if (e) {
                    var i = e.textureCacheIds.indexOf(t);
                    return i > -1 && e.textureCacheIds.splice(i, 1),
                    delete _i[t],
                    e
                }
            } else if (t && t.textureCacheIds) {
                for (var r = 0; r < t.textureCacheIds.length; ++r)
                    _i[t.textureCacheIds[r]] === t && delete _i[t.textureCacheIds[r]];
                return t.textureCacheIds.length = 0,
                t
            }
            return null
        }
        ,
        i.resolution.get = function() {
            return this.baseTexture.resolution
        }
        ,
        i.frame.get = function() {
            return this._frame
        }
        ,
        i.frame.set = function(t) {
            this._frame = t,
            this.noFrame = !1;
            var e = t.x
              , i = t.y
              , r = t.width
              , n = t.height
              , o = e + r > this.baseTexture.width
              , s = i + n > this.baseTexture.height;
            if (o || s) {
                var a = o && s ? "and" : "or"
                  , h = "X: " + e + " + " + r + " = " + (e + r) + " > " + this.baseTexture.width
                  , u = "Y: " + i + " + " + n + " = " + (i + n) + " > " + this.baseTexture.height;
                throw new Error("Texture Error: frame does not fit inside the base Texture dimensions: " + h + " " + a + " " + u)
            }
            this.valid = r && n && this.baseTexture.valid,
            this.trim || this.rotate || (this.orig = t),
            this.valid && this.updateUvs()
        }
        ,
        i.rotate.get = function() {
            return this._rotate
        }
        ,
        i.rotate.set = function(t) {
            this._rotate = t,
            this.valid && this.updateUvs()
        }
        ,
        i.width.get = function() {
            return this.orig.width
        }
        ,
        i.height.get = function() {
            return this.orig.height
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Pe);
    Lr.EMPTY = new Lr(new xr),
    ft(Lr.EMPTY),
    ft(Lr.EMPTY.baseTexture),
    Lr.WHITE = function() {
        var t = document.createElement("canvas");
        t.width = 16,
        t.height = 16;
        var e = t.getContext("2d");
        return e.fillStyle = "white",
        e.fillRect(0, 0, 16, 16),
        new Lr(new xr(new Tr(t)))
    }(),
    ft(Lr.WHITE),
    ft(Lr.WHITE.baseTexture);
    var Nr = function(t) {
        function e(e, i) {
            var r = null;
            if (!(e instanceof Dr)) {
                var n = arguments[1]
                  , o = arguments[2]
                  , s = arguments[3]
                  , a = arguments[4];
                console.warn("Please use RenderTexture.create(" + n + ", " + o + ") instead of the ctor directly."),
                r = arguments[0],
                i = null,
                e = new Dr({
                    width: n,
                    height: o,
                    scaleMode: s,
                    resolution: a
                })
            }
            t.call(this, e, i),
            this.legacyRenderer = r,
            this.valid = !0,
            this.filterFrame = null,
            this.filterPoolKey = null,
            this.updateUvs()
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.resize = function(t, e, i) {
            void 0 === i && (i = !0),
            t = Math.ceil(t),
            e = Math.ceil(e),
            this.valid = t > 0 && e > 0,
            this._frame.width = this.orig.width = t,
            this._frame.height = this.orig.height = e,
            i && this.baseTexture.resize(t, e),
            this.updateUvs()
        }
        ,
        e.prototype.setResolution = function(t) {
            var e = this
              , i = e.baseTexture;
            i.resolution !== t && (i.setResolution(t),
            this.resize(i.width, i.height, !1))
        }
        ,
        e.create = function(t) {
            return "number" == typeof t && (t = {
                width: t,
                height: arguments[1],
                scaleMode: arguments[2],
                resolution: arguments[3]
            }),
            new e(new Dr(t))
        }
        ,
        e
    }(Lr)
      , Br = function(t) {
        this.texturePool = {},
        this.textureOptions = t || {},
        this.enableFullScreen = !1,
        this._pixelsWidth = 0,
        this._pixelsHeight = 0
    };
    Br.prototype.createTexture = function(t, e) {
        var i = new Dr(Object.assign({
            width: t,
            height: e,
            resolution: 1
        }, this.textureOptions));
        return new Nr(i)
    }
    ,
    Br.prototype.getOptimalTexture = function(t, e, i) {
        void 0 === i && (i = 1);
        var r = Br.SCREEN_KEY;
        t *= i,
        e *= i,
        this.enableFullScreen && t === this._pixelsWidth && e === this._pixelsHeight || (t = it(t),
        e = it(e),
        r = (65535 & t) << 16 | 65535 & e),
        this.texturePool[r] || (this.texturePool[r] = []);
        var n = this.texturePool[r].pop();
        return n || (n = this.createTexture(t, e)),
        n.filterPoolKey = r,
        n.setResolution(i),
        n
    }
    ,
    Br.prototype.getFilterTexture = function(t, e) {
        var i = this.getOptimalTexture(t.width, t.height, e || t.resolution);
        return i.filterFrame = t.filterFrame,
        i
    }
    ,
    Br.prototype.returnTexture = function(t) {
        var e = t.filterPoolKey;
        t.filterFrame = null,
        this.texturePool[e].push(t)
    }
    ,
    Br.prototype.returnFilterTexture = function(t) {
        this.returnTexture(t)
    }
    ,
    Br.prototype.clear = function(t) {
        if (t = !1 !== t)
            for (var e in this.texturePool) {
                var i = this.texturePool[e];
                if (i)
                    for (var r = 0; r < i.length; r++)
                        i[r].destroy(!0)
            }
        this.texturePool = {}
    }
    ,
    Br.prototype.setScreenSize = function(t) {
        if (t.width !== this._pixelsWidth || t.height !== this._pixelsHeight) {
            var e = Br.SCREEN_KEY
              , i = this.texturePool[e];
            if (this.enableFullScreen = t.width > 0 && t.height > 0,
            i)
                for (var r = 0; r < i.length; r++)
                    i[r].destroy(!0);
            this.texturePool[e] = [],
            this._pixelsWidth = t.width,
            this._pixelsHeight = t.height
        }
    }
    ,
    Br.SCREEN_KEY = "screen";
    var Ur = function(t, e, i, r, n, o, s) {
        void 0 === i && (i = !1),
        void 0 === r && (r = 5126),
        this.buffer = t,
        this.size = e,
        this.normalized = i,
        this.type = r,
        this.stride = n,
        this.start = o,
        this.instance = s
    };
    Ur.prototype.destroy = function() {
        this.buffer = null
    }
    ,
    Ur.from = function(t, e, i, r, n) {
        return new Ur(t,e,i,r,n)
    }
    ;
    var kr = 0
      , Xr = function(t, e, i) {
        void 0 === e && (e = !0),
        void 0 === i && (i = !1),
        this.data = t || new Float32Array(1),
        this._glBuffers = {},
        this._updateID = 0,
        this.index = i,
        this.static = e,
        this.id = kr++,
        this.disposeRunner = new or("disposeBuffer",2)
    };
    Xr.prototype.update = function(t) {
        this.data = t || this.data,
        this._updateID++
    }
    ,
    Xr.prototype.dispose = function() {
        this.disposeRunner.run(this, !1)
    }
    ,
    Xr.prototype.destroy = function() {
        this.dispose(),
        this.data = null
    }
    ,
    Xr.from = function(t) {
        return t instanceof Array && (t = new Float32Array(t)),
        new Xr(t)
    }
    ;
    var jr = {
        Float32Array: Float32Array,
        Uint32Array: Uint32Array,
        Int32Array: Int32Array,
        Uint8Array: Uint8Array
    }
      , Gr = {
        5126: 4,
        5123: 2,
        5121: 1
    }
      , Hr = 0
      , zr = {
        Float32Array: Float32Array,
        Uint32Array: Uint32Array,
        Int32Array: Int32Array,
        Uint8Array: Uint8Array,
        Uint16Array: Uint16Array
    }
      , Vr = function(t, e) {
        void 0 === t && (t = []),
        void 0 === e && (e = {}),
        this.buffers = t,
        this.indexBuffer = null,
        this.attributes = e,
        this.glVertexArrayObjects = {},
        this.id = Hr++,
        this.instanced = !1,
        this.instanceCount = 1,
        this.disposeRunner = new or("disposeGeometry",2),
        this.refCount = 0
    };
    Vr.prototype.addAttribute = function(t, e, i, r, n, o, s, a) {
        if (void 0 === r && (r = !1),
        void 0 === a && (a = !1),
        !e)
            throw new Error("You must pass a buffer when creating an attribute");
        e.data || (e instanceof Array && (e = new Float32Array(e)),
        e = new Xr(e));
        var h = t.split("|");
        if (h.length > 1) {
            for (var u = 0; u < h.length; u++)
                this.addAttribute(h[u], e, i, r, n);
            return this
        }
        var l = this.buffers.indexOf(e);
        return -1 === l && (this.buffers.push(e),
        l = this.buffers.length - 1),
        this.attributes[t] = new Ur(l,i,r,n,o,s,a),
        this.instanced = this.instanced || a,
        this
    }
    ,
    Vr.prototype.getAttribute = function(t) {
        return this.attributes[t]
    }
    ,
    Vr.prototype.getBuffer = function(t) {
        return this.buffers[this.getAttribute(t).buffer]
    }
    ,
    Vr.prototype.addIndex = function(t) {
        return t.data || (t instanceof Array && (t = new Uint16Array(t)),
        t = new Xr(t)),
        t.index = !0,
        this.indexBuffer = t,
        -1 === this.buffers.indexOf(t) && this.buffers.push(t),
        this
    }
    ,
    Vr.prototype.getIndex = function() {
        return this.indexBuffer
    }
    ,
    Vr.prototype.interleave = function() {
        if (1 === this.buffers.length || 2 === this.buffers.length && this.indexBuffer)
            return this;
        var t, e = [], i = [], r = new Xr;
        for (t in this.attributes) {
            var n = this.attributes[t]
              , o = this.buffers[n.buffer];
            e.push(o.data),
            i.push(n.size * Gr[n.type] / 4),
            n.buffer = 0
        }
        for (r.data = gt(e, i),
        t = 0; t < this.buffers.length; t++)
            this.buffers[t] !== this.indexBuffer && this.buffers[t].destroy();
        return this.buffers = [r],
        this.indexBuffer && this.buffers.push(this.indexBuffer),
        this
    }
    ,
    Vr.prototype.getSize = function() {
        for (var t in this.attributes) {
            var e = this.attributes[t];
            return this.buffers[e.buffer].data.length / (e.stride / 4 || e.size)
        }
        return 0
    }
    ,
    Vr.prototype.dispose = function() {
        this.disposeRunner.run(this, !1)
    }
    ,
    Vr.prototype.destroy = function() {
        this.dispose(),
        this.buffers = null,
        this.indexBuffer.destroy(),
        this.attributes = null
    }
    ,
    Vr.prototype.clone = function() {
        for (var t = new Vr, e = 0; e < this.buffers.length; e++)
            t.buffers[e] = new Xr(this.buffers[e].data.slice());
        for (var i in this.attributes) {
            var r = this.attributes[i];
            t.attributes[i] = new Ur(r.buffer,r.size,r.normalized,r.type,r.stride,r.start,r.instance)
        }
        return this.indexBuffer && (t.indexBuffer = t.buffers[this.buffers.indexOf(this.indexBuffer)],
        t.indexBuffer.index = !0),
        t
    }
    ,
    Vr.merge = function(t) {
        for (var e, i = new Vr, r = [], n = [], o = [], s = 0; s < t.length; s++) {
            e = t[s];
            for (var a = 0; a < e.buffers.length; a++)
                n[a] = n[a] || 0,
                n[a] += e.buffers[a].data.length,
                o[a] = 0
        }
        for (var h = 0; h < e.buffers.length; h++)
            r[h] = new (zr[vt(e.buffers[h].data)])(n[h]),
            i.buffers[h] = new Xr(r[h]);
        for (var u = 0; u < t.length; u++) {
            e = t[u];
            for (var l = 0; l < e.buffers.length; l++)
                r[l].set(e.buffers[l].data, o[l]),
                o[l] += e.buffers[l].data.length
        }
        if (i.attributes = e.attributes,
        e.indexBuffer) {
            i.indexBuffer = i.buffers[e.buffers.indexOf(e.indexBuffer)],
            i.indexBuffer.index = !0;
            for (var c = 0, d = 0, p = 0, f = 0, v = 0; v < e.buffers.length; v++)
                if (e.buffers[v] !== e.indexBuffer) {
                    f = v;
                    break
                }
            for (var g in e.attributes) {
                var m = e.attributes[g];
                (0 | m.buffer) === f && (d += m.size * Gr[m.type] / 4)
            }
            for (var y = 0; y < t.length; y++) {
                for (var _ = t[y].indexBuffer.data, x = 0; x < _.length; x++)
                    i.indexBuffer.data[x + p] += c;
                c += e.buffers[f].data.length / d,
                p += _.length
            }
        }
        return i
    }
    ;
    var Yr = function(t) {
        function e() {
            t.call(this),
            this.addAttribute("aVertexPosition", [0, 0, 1, 0, 1, 1, 0, 1]).addIndex([0, 1, 3, 2])
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e
    }(Vr)
      , Wr = function(t) {
        function e() {
            t.call(this),
            this.vertices = new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]),
            this.uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
            this.vertexBuffer = new Xr(this.vertices),
            this.uvBuffer = new Xr(this.uvs),
            this.addAttribute("aVertexPosition", this.vertexBuffer).addAttribute("aTextureCoord", this.uvBuffer).addIndex([0, 1, 2, 0, 2, 3])
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.map = function(t, e) {
            var i = 0
              , r = 0;
            return this.uvs[0] = i,
            this.uvs[1] = r,
            this.uvs[2] = i + e.width / t.width,
            this.uvs[3] = r,
            this.uvs[4] = i + e.width / t.width,
            this.uvs[5] = r + e.height / t.height,
            this.uvs[6] = i,
            this.uvs[7] = r + e.height / t.height,
            i = e.x,
            r = e.y,
            this.vertices[0] = i,
            this.vertices[1] = r,
            this.vertices[2] = i + e.width,
            this.vertices[3] = r,
            this.vertices[4] = i + e.width,
            this.vertices[5] = r + e.height,
            this.vertices[6] = i,
            this.vertices[7] = r + e.height,
            this.invalidate(),
            this
        }
        ,
        e.prototype.invalidate = function() {
            return this.vertexBuffer._updateID++,
            this.uvBuffer._updateID++,
            this
        }
        ,
        e
    }(Vr)
      , qr = 0
      , Zr = function(t, e) {
        this.uniforms = t,
        this.group = !0,
        this.syncUniforms = {},
        this.dirtyId = 0,
        this.id = qr++,
        this.static = !!e
    };
    Zr.prototype.update = function() {
        this.dirtyId++
    }
    ,
    Zr.prototype.add = function(t, e, i) {
        this.uniforms[t] = new Zr(e,i)
    }
    ,
    Zr.from = function(t, e) {
        return new Zr(t,e)
    }
    ;
    var Kr = function() {
        this.renderTexture = null,
        this.target = null,
        this.legacy = !1,
        this.resolution = 1,
        this.sourceFrame = new Yi,
        this.destinationFrame = new Yi,
        this.filters = []
    };
    Kr.prototype.clear = function() {
        this.target = null,
        this.filters = null,
        this.renderTexture = null
    }
    ;
    var Jr = function(t) {
        function e(e) {
            t.call(this, e),
            this.defaultFilterStack = [{}],
            this.texturePool = new Br,
            this.texturePool.setScreenSize(e.view),
            this.statePool = [],
            this.quad = new Yr,
            this.quadUv = new Wr,
            this.tempRect = new Yi,
            this.activeState = {},
            this.globalUniforms = new Zr({
                outputFrame: this.tempRect,
                inputSize: new Float32Array(4),
                inputPixel: new Float32Array(4),
                inputClamp: new Float32Array(4),
                resolution: 1,
                filterArea: new Float32Array(4),
                filterClamp: new Float32Array(4)
            },!0),
            this._pixelsWidth = e.view.width,
            this._pixelsHeight = e.view.height
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.push = function(t, e) {
            for (var i = this.renderer, r = this.defaultFilterStack, n = this.statePool.pop() || new Kr, o = e[0].resolution, s = e[0].padding, a = e[0].autoFit, h = e[0].legacy, u = 1; u < e.length; u++) {
                var l = e[u];
                o = Math.min(o, l.resolution),
                s = Math.max(s, l.padding),
                a = a || l.autoFit,
                h = h || l.legacy
            }
            1 === r.length && (this.defaultFilterStack[0].renderTexture = i.renderTexture.current),
            r.push(n),
            n.resolution = o,
            n.legacy = h,
            n.target = t,
            n.sourceFrame.copyFrom(t.filterArea || t.getBounds(!0)),
            n.sourceFrame.pad(s),
            a && n.sourceFrame.fit(this.renderer.renderTexture.sourceFrame),
            n.sourceFrame.ceil(o),
            n.renderTexture = this.getOptimalFilterTexture(n.sourceFrame.width, n.sourceFrame.height, o),
            n.filters = e,
            n.destinationFrame.width = n.renderTexture.width,
            n.destinationFrame.height = n.renderTexture.height,
            n.renderTexture.filterFrame = n.sourceFrame,
            i.renderTexture.bind(n.renderTexture, n.sourceFrame),
            i.renderTexture.clear()
        }
        ,
        e.prototype.pop = function() {
            var t = this.defaultFilterStack
              , e = t.pop()
              , i = e.filters;
            this.activeState = e;
            var r = this.globalUniforms.uniforms;
            r.outputFrame = e.sourceFrame,
            r.resolution = e.resolution;
            var n = r.inputSize
              , o = r.inputPixel
              , s = r.inputClamp;
            if (n[0] = e.destinationFrame.width,
            n[1] = e.destinationFrame.height,
            n[2] = 1 / n[0],
            n[3] = 1 / n[1],
            o[0] = n[0] * e.resolution,
            o[1] = n[1] * e.resolution,
            o[2] = 1 / o[0],
            o[3] = 1 / o[1],
            s[0] = .5 * o[2],
            s[1] = .5 * o[3],
            s[2] = e.sourceFrame.width * n[2] - .5 * o[2],
            s[3] = e.sourceFrame.height * n[3] - .5 * o[3],
            e.legacy) {
                var a = r.filterArea;
                a[0] = e.destinationFrame.width,
                a[1] = e.destinationFrame.height,
                a[2] = e.sourceFrame.x,
                a[3] = e.sourceFrame.y,
                r.filterClamp = r.inputClamp
            }
            this.globalUniforms.update();
            var h = t[t.length - 1];
            if (1 === i.length)
                i[0].apply(this, e.renderTexture, h.renderTexture, !1, e),
                this.returnFilterTexture(e.renderTexture);
            else {
                var u = e.renderTexture
                  , l = this.getOptimalFilterTexture(u.width, u.height, e.resolution);
                l.filterFrame = u.filterFrame;
                var c = 0;
                for (c = 0; c < i.length - 1; ++c) {
                    i[c].apply(this, u, l, !0, e);
                    var d = u;
                    u = l,
                    l = d
                }
                i[c].apply(this, u, h.renderTexture, !1, e),
                this.returnFilterTexture(u),
                this.returnFilterTexture(l)
            }
            e.clear(),
            this.statePool.push(e)
        }
        ,
        e.prototype.applyFilter = function(t, e, i, r) {
            var n = this.renderer;
            n.renderTexture.bind(i, i ? i.filterFrame : null),
            r && n.renderTexture.clear(),
            t.uniforms.uSampler = e,
            t.uniforms.filterGlobals = this.globalUniforms,
            n.state.set(t.state),
            n.shader.bind(t),
            t.legacy ? (this.quadUv.map(e._frame, e.filterFrame),
            n.geometry.bind(this.quadUv),
            n.geometry.draw(ni.TRIANGLES)) : (n.geometry.bind(this.quad),
            n.geometry.draw(ni.TRIANGLE_STRIP))
        }
        ,
        e.prototype.calculateSpriteMatrix = function(t, e) {
            var i = this.activeState
              , r = i.sourceFrame
              , n = i.destinationFrame
              , o = e._texture
              , s = o.orig
              , a = t.set(n.width, 0, 0, n.height, r.x, r.y)
              , h = e.worldTransform.copyTo(Fi.TEMP_MATRIX);
            return h.invert(),
            a.prepend(h),
            a.scale(1 / s.width, 1 / s.height),
            a.translate(e.anchor.x, e.anchor.y),
            a
        }
        ,
        e.prototype.destroy = function() {
            this.texturePool.clear(!1)
        }
        ,
        e.prototype.getOptimalFilterTexture = function(t, e, i) {
            return void 0 === i && (i = 1),
            this.texturePool.getOptimalTexture(t, e, i)
        }
        ,
        e.prototype.getFilterTexture = function(t, e) {
            if ("number" == typeof t) {
                var i = t;
                t = e,
                e = i
            }
            t = t || this.activeState.renderTexture;
            var r = this.texturePool.getOptimalTexture(t.width, t.height, e || t.resolution);
            return r.filterFrame = t.filterFrame,
            r
        }
        ,
        e.prototype.returnFilterTexture = function(t) {
            this.texturePool.returnTexture(t)
        }
        ,
        e.prototype.emptyPool = function() {
            this.texturePool.clear(!0)
        }
        ,
        e.prototype.resize = function() {
            this.texturePool.setScreenSize(this.renderer.view)
        }
        ,
        e
    }(Ar)
      , Qr = function(t) {
        this.renderer = t
    };
    Qr.prototype.flush = function() {}
    ,
    Qr.prototype.destroy = function() {
        this.renderer = null
    }
    ,
    Qr.prototype.start = function() {}
    ,
    Qr.prototype.stop = function() {
        this.flush()
    }
    ,
    Qr.prototype.render = function(t) {}
    ;
    var $r = function(t) {
        function e(e) {
            t.call(this, e),
            this.emptyRenderer = new Qr(e),
            this.currentRenderer = this.emptyRenderer
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.setObjectRenderer = function(t) {
            this.currentRenderer !== t && (this.currentRenderer.stop(),
            this.currentRenderer = t,
            this.currentRenderer.start())
        }
        ,
        e.prototype.flush = function() {
            this.setObjectRenderer(this.emptyRenderer)
        }
        ,
        e.prototype.reset = function() {
            this.setObjectRenderer(this.emptyRenderer)
        }
        ,
        e
    }(Ar);
    Ie.PREFER_ENV = Se.any ? ei.WEBGL : ei.WEBGL2;
    var tn, en, rn = 0, nn = function(t) {
        function e(e) {
            t.call(this, e),
            this.webGLVersion = 1,
            this.extensions = {},
            this.handleContextLost = this.handleContextLost.bind(this),
            this.handleContextRestored = this.handleContextRestored.bind(this),
            e.view.addEventListener("webglcontextlost", this.handleContextLost, !1),
            e.view.addEventListener("webglcontextrestored", this.handleContextRestored, !1)
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            isLost: {
                configurable: !0
            }
        };
        return i.isLost.get = function() {
            return !this.gl || this.gl.isContextLost()
        }
        ,
        e.prototype.contextChange = function(t) {
            this.gl = t,
            this.renderer.gl = t,
            this.renderer.CONTEXT_UID = rn++,
            t.isContextLost() && t.getExtension("WEBGL_lose_context") && t.getExtension("WEBGL_lose_context").restoreContext()
        }
        ,
        e.prototype.initFromContext = function(t) {
            this.gl = t,
            this.validateContext(t),
            this.renderer.gl = t,
            this.renderer.CONTEXT_UID = rn++,
            this.renderer.runners.contextChange.run(t)
        }
        ,
        e.prototype.initFromOptions = function(t) {
            var e = this.createContext(this.renderer.view, t);
            this.initFromContext(e)
        }
        ,
        e.prototype.createContext = function(t, e) {
            var i;
            if (Ie.PREFER_ENV >= ei.WEBGL2 && (i = t.getContext("webgl2", e)),
            i)
                this.webGLVersion = 2;
            else if (this.webGLVersion = 1,
            !(i = t.getContext("webgl", e) || t.getContext("experimental-webgl", e)))
                throw new Error("This browser does not support WebGL. Try using the canvas renderer");
            return this.gl = i,
            this.getExtensions(),
            i
        }
        ,
        e.prototype.getExtensions = function() {
            var t = this
              , e = t.gl;
            1 === this.webGLVersion ? Object.assign(this.extensions, {
                drawBuffers: e.getExtension("WEBGL_draw_buffers"),
                depthTexture: e.getExtension("WEBKIT_WEBGL_depth_texture"),
                loseContext: e.getExtension("WEBGL_lose_context"),
                vertexArrayObject: e.getExtension("OES_vertex_array_object") || e.getExtension("MOZ_OES_vertex_array_object") || e.getExtension("WEBKIT_OES_vertex_array_object"),
                anisotropicFiltering: e.getExtension("EXT_texture_filter_anisotropic"),
                uint32ElementIndex: e.getExtension("OES_element_index_uint"),
                floatTexture: e.getExtension("OES_texture_float"),
                floatTextureLinear: e.getExtension("OES_texture_float_linear"),
                textureHalfFloat: e.getExtension("OES_texture_half_float"),
                textureHalfFloatLinear: e.getExtension("OES_texture_half_float_linear")
            }) : 2 === this.webGLVersion && Object.assign(this.extensions, {
                anisotropicFiltering: e.getExtension("EXT_texture_filter_anisotropic"),
                colorBufferFloat: e.getExtension("EXT_color_buffer_float"),
                floatTextureLinear: e.getExtension("OES_texture_float_linear")
            })
        }
        ,
        e.prototype.handleContextLost = function(t) {
            t.preventDefault()
        }
        ,
        e.prototype.handleContextRestored = function() {
            this.renderer.runners.contextChange.run(this.gl)
        }
        ,
        e.prototype.destroy = function() {
            var t = this.renderer.view;
            t.removeEventListener("webglcontextlost", this.handleContextLost),
            t.removeEventListener("webglcontextrestored", this.handleContextRestored),
            this.gl.useProgram(null),
            this.extensions.loseContext && this.extensions.loseContext.loseContext()
        }
        ,
        e.prototype.postrender = function() {
            this.gl.flush()
        }
        ,
        e.prototype.validateContext = function(t) {
            t.getContextAttributes().stencil || console.warn("Provided WebGL context does not have a stencil buffer, masks may not render correctly")
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Ar), on = function(t) {
        function e(e) {
            t.call(this, e),
            this.managedFramebuffers = [],
            this.unknownFramebuffer = new Cr(10,10)
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            size: {
                configurable: !0
            }
        };
        return e.prototype.contextChange = function() {
            var t = this.gl = this.renderer.gl;
            if (this.CONTEXT_UID = this.renderer.CONTEXT_UID,
            this.current = this.unknownFramebuffer,
            this.viewport = new Yi,
            this.hasMRT = !0,
            this.writeDepthTexture = !0,
            this.disposeAll(!0),
            1 === this.renderer.context.webGLVersion) {
                var e = this.renderer.context.extensions.drawBuffers
                  , i = this.renderer.context.extensions.depthTexture;
                Ie.PREFER_ENV === ei.WEBGL_LEGACY && (e = null,
                i = null),
                e ? t.drawBuffers = function(t) {
                    return e.drawBuffersWEBGL(t)
                }
                : (this.hasMRT = !1,
                t.drawBuffers = function() {}
                ),
                i || (this.writeDepthTexture = !1)
            }
        }
        ,
        e.prototype.bind = function(t, e) {
            var i = this
              , r = i.gl;
            if (t) {
                var n = t.glFramebuffers[this.CONTEXT_UID] || this.initFramebuffer(t);
                this.current !== t && (this.current = t,
                r.bindFramebuffer(r.FRAMEBUFFER, n.framebuffer)),
                n.dirtyId !== t.dirtyId && (n.dirtyId = t.dirtyId,
                n.dirtyFormat !== t.dirtyFormat ? (n.dirtyFormat = t.dirtyFormat,
                this.updateFramebuffer(t)) : n.dirtySize !== t.dirtySize && (n.dirtySize = t.dirtySize,
                this.resizeFramebuffer(t)));
                for (var o = 0; o < t.colorTextures.length; o++)
                    t.colorTextures[o].texturePart ? this.renderer.texture.unbind(t.colorTextures[o].texture) : this.renderer.texture.unbind(t.colorTextures[o]);
                t.depthTexture && this.renderer.texture.unbind(t.depthTexture),
                e ? this.setViewport(e.x, e.y, e.width, e.height) : this.setViewport(0, 0, t.width, t.height)
            } else
                this.current && (this.current = null,
                r.bindFramebuffer(r.FRAMEBUFFER, null)),
                e ? this.setViewport(e.x, e.y, e.width, e.height) : this.setViewport(0, 0, this.renderer.width, this.renderer.height)
        }
        ,
        e.prototype.setViewport = function(t, e, i, r) {
            var n = this.viewport;
            n.width === i && n.height === r && n.x === t && n.y === e || (n.x = t,
            n.y = e,
            n.width = i,
            n.height = r,
            this.gl.viewport(t, e, i, r))
        }
        ,
        i.size.get = function() {
            return this.current ? {
                x: 0,
                y: 0,
                width: this.current.width,
                height: this.current.height
            } : {
                x: 0,
                y: 0,
                width: this.renderer.width,
                height: this.renderer.height
            }
        }
        ,
        e.prototype.clear = function(t, e, i, r) {
            var n = this
              , o = n.gl;
            o.clearColor(t, e, i, r),
            o.clear(o.COLOR_BUFFER_BIT | o.DEPTH_BUFFER_BIT)
        }
        ,
        e.prototype.initFramebuffer = function(t) {
            var e = this
              , i = e.gl
              , r = {
                framebuffer: i.createFramebuffer(),
                stencil: null,
                dirtyId: 0,
                dirtyFormat: 0,
                dirtySize: 0
            };
            return t.glFramebuffers[this.CONTEXT_UID] = r,
            this.managedFramebuffers.push(t),
            t.disposeRunner.add(this),
            r
        }
        ,
        e.prototype.resizeFramebuffer = function(t) {
            var e = this
              , i = e.gl
              , r = t.glFramebuffers[this.CONTEXT_UID];
            r.stencil && (i.bindRenderbuffer(i.RENDERBUFFER, r.stencil),
            i.renderbufferStorage(i.RENDERBUFFER, i.DEPTH_STENCIL, t.width, t.height));
            for (var n = t.colorTextures, o = 0; o < n.length; o++)
                this.renderer.texture.bind(n[o], 0);
            t.depthTexture && this.renderer.texture.bind(t.depthTexture, 0)
        }
        ,
        e.prototype.updateFramebuffer = function(t) {
            var e = this
              , i = e.gl
              , r = t.glFramebuffers[this.CONTEXT_UID]
              , n = t.colorTextures
              , o = n.length;
            i.drawBuffers || (o = Math.min(o, 1));
            for (var s = [], a = 0; a < o; a++) {
                var h = t.colorTextures[a];
                h.texturePart ? (this.renderer.texture.bind(h.texture, 0),
                i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + a, i.TEXTURE_CUBE_MAP_NEGATIVE_X + h.side, h.texture._glTextures[this.CONTEXT_UID].texture, 0)) : (this.renderer.texture.bind(h, 0),
                i.framebufferTexture2D(i.FRAMEBUFFER, i.COLOR_ATTACHMENT0 + a, i.TEXTURE_2D, h._glTextures[this.CONTEXT_UID].texture, 0)),
                s.push(i.COLOR_ATTACHMENT0 + a)
            }
            if (s.length > 1 && i.drawBuffers(s),
            t.depthTexture) {
                if (this.writeDepthTexture) {
                    var u = t.depthTexture;
                    this.renderer.texture.bind(u, 0),
                    i.framebufferTexture2D(i.FRAMEBUFFER, i.DEPTH_ATTACHMENT, i.TEXTURE_2D, u._glTextures[this.CONTEXT_UID].texture, 0)
                }
            }
            r.stencil || !t.stencil && !t.depth || (r.stencil = i.createRenderbuffer(),
            i.bindRenderbuffer(i.RENDERBUFFER, r.stencil),
            i.renderbufferStorage(i.RENDERBUFFER, i.DEPTH_STENCIL, t.width, t.height),
            t.depthTexture || i.framebufferRenderbuffer(i.FRAMEBUFFER, i.DEPTH_STENCIL_ATTACHMENT, i.RENDERBUFFER, r.stencil))
        }
        ,
        e.prototype.disposeFramebuffer = function(t, e) {
            var i = t.glFramebuffers[this.CONTEXT_UID]
              , r = this.gl;
            if (i) {
                delete t.glFramebuffers[this.CONTEXT_UID];
                var n = this.managedFramebuffers.indexOf(t);
                n >= 0 && this.managedFramebuffers.splice(n, 1),
                t.disposeRunner.remove(this),
                e || (r.deleteFramebuffer(i.framebuffer),
                i.stencil && r.deleteRenderbuffer(i.stencil))
            }
        }
        ,
        e.prototype.disposeAll = function(t) {
            var e = this.managedFramebuffers;
            this.managedFramebuffers = [];
            for (var i = 0; i < e.length; i++)
                this.disposeFramebuffer(e[i], t)
        }
        ,
        e.prototype.forceStencil = function() {
            var t = this.current;
            if (t) {
                var e = t.glFramebuffers[this.CONTEXT_UID];
                if (e && !e.stencil) {
                    t.enableStencil();
                    var i = t.width
                      , r = t.height
                      , n = this.gl
                      , o = n.createRenderbuffer();
                    n.bindRenderbuffer(n.RENDERBUFFER, o),
                    n.renderbufferStorage(n.RENDERBUFFER, n.DEPTH_STENCIL, i, r),
                    e.stencil = o,
                    n.framebufferRenderbuffer(n.FRAMEBUFFER, n.DEPTH_STENCIL_ATTACHMENT, n.RENDERBUFFER, o)
                }
            }
        }
        ,
        e.prototype.reset = function() {
            this.current = this.unknownFramebuffer,
            this.viewport = new Yi
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Ar), sn = function(t) {
        this.buffer = t,
        this.updateID = -1,
        this.byteLength = -1,
        this.refCount = 0
    }, an = {
        5126: 4,
        5123: 2,
        5121: 1
    }, hn = function(t) {
        function e(e) {
            t.call(this, e),
            this._activeGeometry = null,
            this._activeVao = null,
            this.hasVao = !0,
            this.hasInstance = !0,
            this.canUseUInt32ElementIndex = !1,
            this.boundBuffers = {},
            this.managedGeometries = {},
            this.managedBuffers = {}
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.contextChange = function() {
            this.disposeAll(!0);
            var t = this.gl = this.renderer.gl
              , e = this.renderer.context;
            if (this.CONTEXT_UID = this.renderer.CONTEXT_UID,
            !t.createVertexArray) {
                var i = this.renderer.context.extensions.vertexArrayObject;
                Ie.PREFER_ENV === ei.WEBGL_LEGACY && (i = null),
                i ? (t.createVertexArray = function() {
                    return i.createVertexArrayOES()
                }
                ,
                t.bindVertexArray = function(t) {
                    return i.bindVertexArrayOES(t)
                }
                ,
                t.deleteVertexArray = function(t) {
                    return i.deleteVertexArrayOES(t)
                }
                ) : (this.hasVao = !1,
                t.createVertexArray = function() {}
                ,
                t.bindVertexArray = function() {}
                ,
                t.deleteVertexArray = function() {}
                )
            }
            if (!t.vertexAttribDivisor) {
                var r = t.getExtension("ANGLE_instanced_arrays");
                r ? (t.vertexAttribDivisor = function(t, e) {
                    return r.vertexAttribDivisorANGLE(t, e)
                }
                ,
                t.drawElementsInstanced = function(t, e, i, n, o) {
                    return r.drawElementsInstancedANGLE(t, e, i, n, o)
                }
                ,
                t.drawArraysInstanced = function(t, e, i, n) {
                    return r.drawArraysInstancedANGLE(t, e, i, n)
                }
                ) : this.hasInstance = !1
            }
            this.canUseUInt32ElementIndex = 2 === e.webGLVersion || !!e.extensions.uint32ElementIndex
        }
        ,
        e.prototype.bind = function(t, e) {
            e = e || this.renderer.shader.shader;
            var i = this
              , r = i.gl
              , n = t.glVertexArrayObjects[this.CONTEXT_UID];
            n || (this.managedGeometries[t.id] = t,
            t.disposeRunner.add(this),
            t.glVertexArrayObjects[this.CONTEXT_UID] = n = {});
            var o = n[e.program.id] || this.initGeometryVao(t, e.program);
            this._activeGeometry = t,
            this._activeVao !== o && (this._activeVao = o,
            this.hasVao ? r.bindVertexArray(o) : this.activateVao(t, e.program)),
            this.updateBuffers()
        }
        ,
        e.prototype.reset = function() {
            this.unbind()
        }
        ,
        e.prototype.updateBuffers = function() {
            for (var t = this._activeGeometry, e = this, i = e.gl, r = 0; r < t.buffers.length; r++) {
                var n = t.buffers[r]
                  , o = n._glBuffers[this.CONTEXT_UID];
                if (n._updateID !== o.updateID) {
                    o.updateID = n._updateID;
                    var s = n.index ? i.ELEMENT_ARRAY_BUFFER : i.ARRAY_BUFFER;
                    if (i.bindBuffer(s, o.buffer),
                    this._boundBuffer = o,
                    o.byteLength >= n.data.byteLength)
                        i.bufferSubData(s, 0, n.data);
                    else {
                        var a = n.static ? i.STATIC_DRAW : i.DYNAMIC_DRAW;
                        o.byteLength = n.data.byteLength,
                        i.bufferData(s, n.data, a)
                    }
                }
            }
        }
        ,
        e.prototype.checkCompatibility = function(t, e) {
            var i = t.attributes
              , r = e.attributeData;
            for (var n in r)
                if (!i[n])
                    throw new Error('shader and geometry incompatible, geometry missing the "' + n + '" attribute')
        }
        ,
        e.prototype.getSignature = function(t, e) {
            var i = t.attributes
              , r = e.attributeData
              , n = ["g", t.id];
            for (var o in i)
                r[o] && n.push(o);
            return n.join("-")
        }
        ,
        e.prototype.initGeometryVao = function(t, e) {
            this.checkCompatibility(t, e);
            var i = this.gl
              , r = this.CONTEXT_UID
              , n = this.getSignature(t, e)
              , o = t.glVertexArrayObjects[this.CONTEXT_UID]
              , s = o[n];
            if (s)
                return o[e.id] = s,
                s;
            var a = t.buffers
              , h = t.attributes
              , u = {}
              , l = {};
            for (var c in a)
                u[c] = 0,
                l[c] = 0;
            for (var d in h)
                !h[d].size && e.attributeData[d] ? h[d].size = e.attributeData[d].size : h[d].size || console.warn("PIXI Geometry attribute '" + d + "' size cannot be determined (likely the bound shader does not have the attribute)"),
                u[h[d].buffer] += h[d].size * an[h[d].type];
            for (var p in h) {
                var f = h[p]
                  , v = f.size;
                void 0 === f.stride && (u[f.buffer] === v * an[f.type] ? f.stride = 0 : f.stride = u[f.buffer]),
                void 0 === f.start && (f.start = l[f.buffer],
                l[f.buffer] += v * an[f.type])
            }
            s = i.createVertexArray(),
            i.bindVertexArray(s);
            for (var g = 0; g < a.length; g++) {
                var m = a[g];
                m._glBuffers[r] || (m._glBuffers[r] = new sn(i.createBuffer()),
                this.managedBuffers[m.id] = m,
                m.disposeRunner.add(this)),
                m._glBuffers[r].refCount++
            }
            return this.activateVao(t, e),
            this._activeVao = s,
            o[e.id] = s,
            o[n] = s,
            s
        }
        ,
        e.prototype.disposeBuffer = function(t, e) {
            if (this.managedBuffers[t.id]) {
                delete this.managedBuffers[t.id];
                var i = t._glBuffers[this.CONTEXT_UID]
                  , r = this.gl;
                t.disposeRunner.remove(this),
                i && (e || r.deleteBuffer(i.buffer),
                delete t._glBuffers[this.CONTEXT_UID])
            }
        }
        ,
        e.prototype.disposeGeometry = function(t, e) {
            if (this.managedGeometries[t.id]) {
                delete this.managedGeometries[t.id];
                var i = t.glVertexArrayObjects[this.CONTEXT_UID]
                  , r = this.gl
                  , n = t.buffers;
                if (t.disposeRunner.remove(this),
                i) {
                    for (var o = 0; o < n.length; o++) {
                        var s = n[o]._glBuffers[this.CONTEXT_UID];
                        s.refCount--,
                        0 !== s.refCount || e || this.disposeBuffer(n[o], e)
                    }
                    if (!e)
                        for (var a in i)
                            if ("g" === a[0]) {
                                var h = i[a];
                                this._activeVao === h && this.unbind(),
                                r.deleteVertexArray(h)
                            }
                    delete t.glVertexArrayObjects[this.CONTEXT_UID]
                }
            }
        }
        ,
        e.prototype.disposeAll = function(t) {
            for (var e = Object.keys(this.managedGeometries), i = 0; i < e.length; i++)
                this.disposeGeometry(this.managedGeometries[e[i]], t);
            e = Object.keys(this.managedBuffers);
            for (var r = 0; r < e.length; r++)
                this.disposeBuffer(this.managedBuffers[e[r]], t)
        }
        ,
        e.prototype.activateVao = function(t, e) {
            var i = this.gl
              , r = this.CONTEXT_UID
              , n = t.buffers
              , o = t.attributes;
            t.indexBuffer && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, t.indexBuffer._glBuffers[r].buffer);
            var s = null;
            for (var a in o) {
                var h = o[a]
                  , u = n[h.buffer]
                  , l = u._glBuffers[r];
                if (e.attributeData[a]) {
                    s !== l && (i.bindBuffer(i.ARRAY_BUFFER, l.buffer),
                    s = l);
                    var c = e.attributeData[a].location;
                    if (i.enableVertexAttribArray(c),
                    i.vertexAttribPointer(c, h.size, h.type || i.FLOAT, h.normalized, h.stride, h.start),
                    h.instance) {
                        if (!this.hasInstance)
                            throw new Error("geometry error, GPU Instancing is not supported on this device");
                        i.vertexAttribDivisor(c, 1)
                    }
                }
            }
        }
        ,
        e.prototype.draw = function(t, e, i, r) {
            var n = this
              , o = n.gl
              , s = this._activeGeometry;
            if (s.indexBuffer) {
                var a = s.indexBuffer.data.BYTES_PER_ELEMENT
                  , h = 2 === a ? o.UNSIGNED_SHORT : o.UNSIGNED_INT;
                2 === a || 4 === a && this.canUseUInt32ElementIndex ? s.instanced ? o.drawElementsInstanced(t, e || s.indexBuffer.data.length, h, (i || 0) * a, r || 1) : o.drawElements(t, e || s.indexBuffer.data.length, h, (i || 0) * a) : console.warn("unsupported index buffer type: uint32")
            } else
                s.instanced ? o.drawArraysInstanced(t, i, e || s.getSize(), r || 1) : o.drawArrays(t, i, e || s.getSize());
            return this
        }
        ,
        e.prototype.unbind = function() {
            this.gl.bindVertexArray(null),
            this._activeVao = null,
            this._activeGeometry = null
        }
        ,
        e
    }(Ar), un = {}, ln = un, cn = {
        float: 1,
        vec2: 2,
        vec3: 3,
        vec4: 4,
        int: 1,
        ivec2: 2,
        ivec3: 3,
        ivec4: 4,
        bool: 1,
        bvec2: 2,
        bvec3: 3,
        bvec4: 4,
        mat2: 4,
        mat3: 9,
        mat4: 16,
        sampler2D: 1
    }, dn = null, pn = {
        FLOAT: "float",
        FLOAT_VEC2: "vec2",
        FLOAT_VEC3: "vec3",
        FLOAT_VEC4: "vec4",
        INT: "int",
        INT_VEC2: "ivec2",
        INT_VEC3: "ivec3",
        INT_VEC4: "ivec4",
        BOOL: "bool",
        BOOL_VEC2: "bvec2",
        BOOL_VEC3: "bvec3",
        BOOL_VEC4: "bvec4",
        FLOAT_MAT2: "mat2",
        FLOAT_MAT3: "mat3",
        FLOAT_MAT4: "mat4",
        SAMPLER_2D: "sampler2D",
        SAMPLER_CUBE: "samplerCube",
        SAMPLER_2D_ARRAY: "sampler2DArray"
    }, fn = {
        float: "\n    if(cv !== v)\n    {\n        cv.v = v;\n        gl.uniform1f(location, v)\n    }",
        vec2: "\n    if(cv[0] !== v[0] || cv[1] !== v[1])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        gl.uniform2f(location, v[0], v[1])\n    }",
        vec3: "\n    if(cv[0] !== v[0] || cv[1] !== v[1] || cv[2] !== v[2])\n    {\n        cv[0] = v[0];\n        cv[1] = v[1];\n        cv[2] = v[2];\n\n        gl.uniform3f(location, v[0], v[1], v[2])\n    }",
        vec4: "gl.uniform4f(location, v[0], v[1], v[2], v[3])",
        int: "gl.uniform1i(location, v)",
        ivec2: "gl.uniform2i(location, v[0], v[1])",
        ivec3: "gl.uniform3i(location, v[0], v[1], v[2])",
        ivec4: "gl.uniform4i(location, v[0], v[1], v[2], v[3])",
        bool: "gl.uniform1i(location, v)",
        bvec2: "gl.uniform2i(location, v[0], v[1])",
        bvec3: "gl.uniform3i(location, v[0], v[1], v[2])",
        bvec4: "gl.uniform4i(location, v[0], v[1], v[2], v[3])",
        mat2: "gl.uniformMatrix2fv(location, false, v)",
        mat3: "gl.uniformMatrix3fv(location, false, v)",
        mat4: "gl.uniformMatrix4fv(location, false, v)",
        sampler2D: "gl.uniform1i(location, v)",
        samplerCube: "gl.uniform1i(location, v)",
        sampler2DArray: "gl.uniform1i(location, v)"
    }, vn = {
        float: "gl.uniform1fv(location, v)",
        vec2: "gl.uniform2fv(location, v)",
        vec3: "gl.uniform3fv(location, v)",
        vec4: "gl.uniform4fv(location, v)",
        mat4: "gl.uniformMatrix4fv(location, false, v)",
        mat3: "gl.uniformMatrix3fv(location, false, v)",
        mat2: "gl.uniformMatrix2fv(location, false, v)",
        int: "gl.uniform1iv(location, v)",
        ivec2: "gl.uniform2iv(location, v)",
        ivec3: "gl.uniform3iv(location, v)",
        ivec4: "gl.uniform4iv(location, v)",
        bool: "gl.uniform1iv(location, v)",
        bvec2: "gl.uniform2iv(location, v)",
        bvec3: "gl.uniform3iv(location, v)",
        bvec4: "gl.uniform4iv(location, v)",
        sampler2D: "gl.uniform1iv(location, v)",
        samplerCube: "gl.uniform1iv(location, v)",
        sampler2DArray: "gl.uniform1iv(location, v)"
    }, gn = ["precision mediump float;", "void main(void){", "float test = 0.1;", "%forloop%", "gl_FragColor = vec4(0.0);", "}"].join("\n"), mn = 0, yn = {}, _n = function t(e, i, r) {
        void 0 === r && (r = "pixi-shader"),
        this.id = mn++,
        this.vertexSrc = e || t.defaultVertexSrc,
        this.fragmentSrc = i || t.defaultFragmentSrc,
        this.vertexSrc = this.vertexSrc.trim(),
        this.fragmentSrc = this.fragmentSrc.trim(),
        "#version" !== this.vertexSrc.substring(0, 8) && (r = r.replace(/\s+/g, "-"),
        yn[r] ? (yn[r]++,
        r += "-" + yn[r]) : yn[r] = 1,
        this.vertexSrc = "#define SHADER_NAME " + r + "\n" + this.vertexSrc,
        this.fragmentSrc = "#define SHADER_NAME " + r + "\n" + this.fragmentSrc,
        this.vertexSrc = wt(this.vertexSrc, Ie.PRECISION_VERTEX, di.HIGH),
        this.fragmentSrc = wt(this.fragmentSrc, Ie.PRECISION_FRAGMENT, Tt())),
        this.extractData(this.vertexSrc, this.fragmentSrc),
        this.glPrograms = {},
        this.syncUniforms = null
    }, xn = {
        defaultVertexSrc: {
            configurable: !0
        },
        defaultFragmentSrc: {
            configurable: !0
        }
    };
    _n.prototype.extractData = function(t, e) {
        var i = bt();
        if (i) {
            var r = mt(i, t, e);
            this.attributeData = this.getAttributeData(r, i),
            this.uniformData = this.getUniformData(r, i),
            i.deleteProgram(r)
        } else
            this.uniformData = {},
            this.attributeData = {}
    }
    ,
    _n.prototype.getAttributeData = function(t, e) {
        for (var i = {}, r = [], n = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES), o = 0; o < n; o++) {
            var s = e.getActiveAttrib(t, o)
              , a = St(e, s.type)
              , h = {
                type: a,
                name: s.name,
                size: Et(a),
                location: 0
            };
            i[s.name] = h,
            r.push(h)
        }
        r.sort(function(t, e) {
            return t.name > e.name ? 1 : -1
        });
        for (var u = 0; u < r.length; u++)
            r[u].location = u;
        return i
    }
    ,
    _n.prototype.getUniformData = function(t, e) {
        for (var i = {}, r = e.getProgramParameter(t, e.ACTIVE_UNIFORMS), n = 0; n < r; n++) {
            var o = e.getActiveUniform(t, n)
              , s = o.name.replace(/\[.*?\]/, "")
              , a = o.name.match(/\[.*?\]/, "")
              , h = St(e, o.type);
            i[s] = {
                type: h,
                size: o.size,
                isArray: a,
                value: _t(h, o.size)
            }
        }
        return i
    }
    ,
    xn.defaultVertexSrc.get = function() {
        return "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vTextureCoord = aTextureCoord;\n}\n"
    }
    ,
    xn.defaultFragmentSrc.get = function() {
        return "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor *= texture2D(uSampler, vTextureCoord);\n}"
    }
    ,
    _n.from = function(t, e, i) {
        var r = t + e
          , n = yi[r];
        return n || (yi[r] = n = new _n(t,e,i)),
        n
    }
    ,
    Object.defineProperties(_n, xn);
    var bn = function(t, e) {
        this.program = t,
        this.uniformGroup = e ? e instanceof Zr ? e : new Zr(e) : new Zr({});
        for (var i in t.uniformData)
            this.uniformGroup.uniforms[i]instanceof Array && (this.uniformGroup.uniforms[i] = new Float32Array(this.uniformGroup.uniforms[i]))
    }
      , Tn = {
        uniforms: {
            configurable: !0
        }
    };
    bn.prototype.checkUniformExists = function(t, e) {
        if (e.uniforms[t])
            return !0;
        for (var i in e.uniforms) {
            var r = e.uniforms[i];
            if (r.group && this.checkUniformExists(t, r))
                return !0
        }
        return !1
    }
    ,
    bn.prototype.destroy = function() {
        this.uniformGroup = null
    }
    ,
    Tn.uniforms.get = function() {
        return this.uniformGroup.uniforms
    }
    ,
    bn.from = function(t, e, i) {
        var r = _n.from(t, e);
        return new bn(r,i)
    }
    ,
    Object.defineProperties(bn.prototype, Tn);
    var wn = function() {
        this.data = 0,
        this.blendMode = ri.NORMAL,
        this.polygonOffset = 0,
        this.blend = !0
    }
      , En = {
        blend: {
            configurable: !0
        },
        offsets: {
            configurable: !0
        },
        culling: {
            configurable: !0
        },
        depthTest: {
            configurable: !0
        },
        clockwiseFrontFace: {
            configurable: !0
        },
        blendMode: {
            configurable: !0
        },
        polygonOffset: {
            configurable: !0
        }
    };
    En.blend.get = function() {
        return !!(1 & this.data)
    }
    ,
    En.blend.set = function(t) {
        !!(1 & this.data) !== t && (this.data ^= 1)
    }
    ,
    En.offsets.get = function() {
        return !!(2 & this.data)
    }
    ,
    En.offsets.set = function(t) {
        !!(2 & this.data) !== t && (this.data ^= 2)
    }
    ,
    En.culling.get = function() {
        return !!(4 & this.data)
    }
    ,
    En.culling.set = function(t) {
        !!(4 & this.data) !== t && (this.data ^= 4)
    }
    ,
    En.depthTest.get = function() {
        return !!(8 & this.data)
    }
    ,
    En.depthTest.set = function(t) {
        !!(8 & this.data) !== t && (this.data ^= 8)
    }
    ,
    En.clockwiseFrontFace.get = function() {
        return !!(16 & this.data)
    }
    ,
    En.clockwiseFrontFace.set = function(t) {
        !!(16 & this.data) !== t && (this.data ^= 16)
    }
    ,
    En.blendMode.get = function() {
        return this._blendMode
    }
    ,
    En.blendMode.set = function(t) {
        this.blend = t !== ri.NONE,
        this._blendMode = t
    }
    ,
    En.polygonOffset.get = function() {
        return this._polygonOffset
    }
    ,
    En.polygonOffset.set = function(t) {
        this.offsets = !!t,
        this._polygonOffset = t
    }
    ,
    wn.for2d = function() {
        var t = new wn;
        return t.depthTest = !1,
        t.blend = !0,
        t
    }
    ,
    Object.defineProperties(wn.prototype, En);
    var Sn = function(t) {
        function e(i, r, n) {
            var o = _n.from(i || e.defaultVertexSrc, r || e.defaultFragmentSrc);
            t.call(this, o, n),
            this.padding = 0,
            this.resolution = Ie.FILTER_RESOLUTION,
            this.enabled = !0,
            this.autoFit = !0,
            this.legacy = !!this.program.attributeData.aTextureCoord,
            this.state = new wn
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            blendMode: {
                configurable: !0
            }
        }
          , r = {
            defaultVertexSrc: {
                configurable: !0
            },
            defaultFragmentSrc: {
                configurable: !0
            }
        };
        return e.prototype.apply = function(t, e, i, r, n) {
            t.applyFilter(this, e, i, r, n)
        }
        ,
        i.blendMode.get = function() {
            return this.state.blendMode
        }
        ,
        i.blendMode.set = function(t) {
            this.state.blendMode = t
        }
        ,
        r.defaultVertexSrc.get = function() {
            return "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n"
        }
        ,
        r.defaultFragmentSrc.get = function() {
            return "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n   gl_FragColor = texture2D(uSampler, vTextureCoord);\n}\n"
        }
        ,
        Object.defineProperties(e.prototype, i),
        Object.defineProperties(e, r),
        e
    }(bn);
    Sn.SOURCE_KEY_MAP = {};
    var In = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 otherMatrix;\n\nvarying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vMaskCoord = ( otherMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n}\n"
      , Pn = "varying vec2 vMaskCoord;\nvarying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform sampler2D mask;\nuniform float alpha;\nuniform float npmAlpha;\nuniform vec4 maskClamp;\n\nvoid main(void)\n{\n    float clip = step(3.5,\n        step(maskClamp.x, vMaskCoord.x) +\n        step(maskClamp.y, vMaskCoord.y) +\n        step(vMaskCoord.x, maskClamp.z) +\n        step(vMaskCoord.y, maskClamp.w));\n\n    vec4 original = texture2D(uSampler, vTextureCoord);\n    vec4 masky = texture2D(mask, vMaskCoord);\n    float alphaMul = 1.0 - npmAlpha * (1.0 - masky.a);\n\n    original *= (alphaMul * masky.r * alpha * clip);\n\n    gl_FragColor = original;\n}\n"
      , An = new Fi
      , On = function(t, e) {
        this._texture = t,
        this.mapCoord = new Fi,
        this.uClampFrame = new Float32Array(4),
        this.uClampOffset = new Float32Array(2),
        this._updateID = -1,
        this.clampOffset = 0,
        this.clampMargin = void 0 === e ? .5 : e,
        this.isSimple = !1
    }
      , Cn = {
        texture: {
            configurable: !0
        }
    };
    Cn.texture.get = function() {
        return this._texture
    }
    ,
    Cn.texture.set = function(t) {
        this._texture = t,
        this._updateID = -1
    }
    ,
    On.prototype.multiplyUvs = function(t, e) {
        void 0 === e && (e = t);
        for (var i = this.mapCoord, r = 0; r < t.length; r += 2) {
            var n = t[r]
              , o = t[r + 1];
            e[r] = n * i.a + o * i.c + i.tx,
            e[r + 1] = n * i.b + o * i.d + i.ty
        }
        return e
    }
    ,
    On.prototype.update = function(t) {
        var e = this._texture;
        if (!e || !e.valid)
            return !1;
        if (!t && this._updateID === e._updateID)
            return !1;
        this._updateID = e._updateID;
        var i = e._uvs;
        this.mapCoord.set(i.x1 - i.x0, i.y1 - i.y0, i.x3 - i.x0, i.y3 - i.y0, i.x0, i.y0);
        var r = e.orig
          , n = e.trim;
        n && (An.set(r.width / n.width, 0, 0, r.height / n.height, -n.x / n.width, -n.y / n.height),
        this.mapCoord.append(An));
        var o = e.baseTexture
          , s = this.uClampFrame
          , a = this.clampMargin / o.resolution
          , h = this.clampOffset;
        return s[0] = (e._frame.x + a + h) / o.width,
        s[1] = (e._frame.y + a + h) / o.height,
        s[2] = (e._frame.x + e._frame.width - a + h) / o.width,
        s[3] = (e._frame.y + e._frame.height - a + h) / o.height,
        this.uClampOffset[0] = h / o.realWidth,
        this.uClampOffset[1] = h / o.realHeight,
        this.isSimple = e._frame.width === o.width && e._frame.height === o.height && 0 === e.rotate,
        !0
    }
    ,
    Object.defineProperties(On.prototype, Cn);
    var Mn = function(t) {
        function e(e) {
            var i = new Fi;
            t.call(this, In, Pn),
            e.renderable = !1,
            this.maskSprite = e,
            this.maskMatrix = i
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.apply = function(t, e, i, r) {
            var n = this.maskSprite
              , o = this.maskSprite.texture;
            o.valid && (o.transform || (o.transform = new On(o,0)),
            o.transform.update(),
            this.uniforms.npmAlpha = o.baseTexture.premultiplyAlpha ? 0 : 1,
            this.uniforms.mask = o,
            this.uniforms.otherMatrix = t.calculateSpriteMatrix(this.maskMatrix, n).prepend(o.transform.mapCoord),
            this.uniforms.alpha = n.worldAlpha,
            this.uniforms.maskClamp = o.transform.uClampFrame,
            t.applyFilter(this, e, i, r))
        }
        ,
        e
    }(Sn)
      , Dn = function(t) {
        function e(e) {
            t.call(this, e),
            this.scissor = !1,
            this.scissorData = null,
            this.scissorRenderTarget = null,
            this.enableScissor = !1,
            this.alphaMaskPool = [],
            this.alphaMaskIndex = 0
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.push = function(t, e) {
            if (e.isSprite)
                this.pushSpriteMask(t, e);
            else if (this.enableScissor && !this.scissor && this.renderer._activeRenderTarget.root && !this.renderer.stencil.stencilMaskStack.length && e.isFastRect()) {
                var i = e.worldTransform
                  , r = Math.atan2(i.b, i.a);
                r = Math.round(r * (180 / Math.PI)),
                r % 90 ? this.pushStencilMask(e) : this.pushScissorMask(t, e)
            } else
                this.pushStencilMask(e)
        }
        ,
        e.prototype.pop = function(t, e) {
            e.isSprite ? this.popSpriteMask(t, e) : this.enableScissor && !this.renderer.stencil.stencilMaskStack.length ? this.popScissorMask(t, e) : this.popStencilMask(t, e)
        }
        ,
        e.prototype.pushSpriteMask = function(t, e) {
            var i = this.alphaMaskPool[this.alphaMaskIndex];
            i || (i = this.alphaMaskPool[this.alphaMaskIndex] = [new Mn(e)]),
            i[0].resolution = this.renderer.resolution,
            i[0].maskSprite = e;
            var r = t.filterArea;
            t.filterArea = e.getBounds(!0),
            this.renderer.filter.push(t, i),
            t.filterArea = r,
            this.alphaMaskIndex++
        }
        ,
        e.prototype.popSpriteMask = function() {
            this.renderer.filter.pop(),
            this.alphaMaskIndex--
        }
        ,
        e.prototype.pushStencilMask = function(t) {
            this.renderer.batch.flush(),
            this.renderer.stencil.pushStencil(t)
        }
        ,
        e.prototype.popStencilMask = function() {
            this.renderer.stencil.popStencil()
        }
        ,
        e.prototype.pushScissorMask = function(t, e) {
            e.renderable = !0;
            var i = this.renderer._activeRenderTarget
              , r = e.getBounds();
            r.fit(i.size),
            e.renderable = !1,
            this.renderer.gl.enable(this.renderer.gl.SCISSOR_TEST);
            var n = this.renderer.resolution;
            this.renderer.gl.scissor(r.x * n, (i.root ? i.size.height - r.y - r.height : r.y) * n, r.width * n, r.height * n),
            this.scissorRenderTarget = i,
            this.scissorData = e,
            this.scissor = !0
        }
        ,
        e.prototype.popScissorMask = function() {
            this.scissorRenderTarget = null,
            this.scissorData = null,
            this.scissor = !1;
            var t = this.renderer
              , e = t.gl;
            e.disable(e.SCISSOR_TEST)
        }
        ,
        e
    }(Ar)
      , Rn = function(t) {
        function e(e) {
            t.call(this, e),
            this.stencilMaskStack = []
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.setMaskStack = function(t) {
            var e = this.renderer.gl
              , i = this.stencilMaskStack.length;
            this.stencilMaskStack = t,
            t.length !== i && (0 === t.length ? e.disable(e.STENCIL_TEST) : (e.enable(e.STENCIL_TEST),
            this._useCurrent()))
        }
        ,
        e.prototype.pushStencil = function(t) {
            var e = this.renderer.gl
              , i = this.stencilMaskStack.length;
            0 === i && (this.renderer.framebuffer.forceStencil(),
            e.enable(e.STENCIL_TEST)),
            this.stencilMaskStack.push(t),
            e.colorMask(!1, !1, !1, !1),
            e.stencilFunc(e.EQUAL, i, this._getBitwiseMask()),
            e.stencilOp(e.KEEP, e.KEEP, e.INCR),
            t.renderable = !0,
            t.render(this.renderer),
            this.renderer.batch.flush(),
            t.renderable = !1,
            this._useCurrent()
        }
        ,
        e.prototype.popStencil = function() {
            var t = this.renderer.gl
              , e = this.stencilMaskStack.pop();
            0 === this.stencilMaskStack.length ? (t.disable(t.STENCIL_TEST),
            t.clear(t.STENCIL_BUFFER_BIT),
            t.clearStencil(0)) : (t.colorMask(!1, !1, !1, !1),
            t.stencilOp(t.KEEP, t.KEEP, t.DECR),
            e.renderable = !0,
            e.render(this.renderer),
            this.renderer.batch.flush(),
            e.renderable = !1,
            this._useCurrent())
        }
        ,
        e.prototype._useCurrent = function() {
            var t = this.renderer.gl;
            t.colorMask(!0, !0, !0, !0),
            t.stencilFunc(t.EQUAL, this.stencilMaskStack.length, this._getBitwiseMask()),
            t.stencilOp(t.KEEP, t.KEEP, t.KEEP)
        }
        ,
        e.prototype._getBitwiseMask = function() {
            return (1 << this.stencilMaskStack.length) - 1
        }
        ,
        e.prototype.destroy = function() {
            t.prototype.destroy.call(this, this),
            this.stencilMaskStack = null
        }
        ,
        e
    }(Ar)
      , Fn = function(t) {
        function e(e) {
            t.call(this, e),
            this.destinationFrame = null,
            this.sourceFrame = null,
            this.defaultFrame = null,
            this.projectionMatrix = new Fi,
            this.transform = null
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.update = function(t, e, i, r) {
            this.destinationFrame = t || this.destinationFrame || this.defaultFrame,
            this.sourceFrame = e || this.sourceFrame || t,
            this.calculateProjection(this.destinationFrame, this.sourceFrame, i, r),
            this.transform && this.projectionMatrix.append(this.transform);
            var n = this.renderer;
            n.globalUniforms.uniforms.projectionMatrix = this.projectionMatrix,
            n.globalUniforms.update(),
            n.shader.shader && n.shader.syncUniformGroup(n.shader.shader.uniforms.globals)
        }
        ,
        e.prototype.calculateProjection = function(t, e, i, r) {
            var n = this.projectionMatrix;
            r ? (n.a = 1 / t.width * 2 * i,
            n.d = -1 / t.height * 2 * i,
            n.tx = -1 - e.x * n.a,
            n.ty = 1 - e.y * n.d) : (n.a = 1 / t.width * 2 * i,
            n.d = 1 / t.height * 2 * i,
            n.tx = -1 - e.x * n.a,
            n.ty = -1 - e.y * n.d)
        }
        ,
        e.prototype.setTransform = function() {}
        ,
        e
    }(Ar)
      , Ln = new Yi
      , Nn = function(t) {
        function e(e) {
            t.call(this, e),
            this.clearColor = e._backgroundColorRgba,
            this.defaultMaskStack = [],
            this.current = null,
            this.sourceFrame = new Yi,
            this.destinationFrame = new Yi
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.bind = function(t, e, i) {
            void 0 === t && (t = null),
            this.current = t;
            var r, n = this.renderer;
            if (t) {
                var o = t.baseTexture;
                r = o.resolution,
                i || (Ln.width = o.realWidth,
                Ln.height = o.realHeight,
                i = Ln),
                e || (e = i),
                this.renderer.framebuffer.bind(o.framebuffer, i),
                this.renderer.projection.update(i, e, r, !1),
                this.renderer.stencil.setMaskStack(o.stencilMaskStack)
            } else
                r = this.renderer.resolution,
                i || (Ln.width = n.width,
                Ln.height = n.height,
                i = Ln),
                e || (e = i),
                n.framebuffer.bind(null, i),
                this.renderer.projection.update(i, e, r, !0),
                this.renderer.stencil.setMaskStack(this.defaultMaskStack);
            this.sourceFrame.copyFrom(e),
            this.destinationFrame.x = i.x / r,
            this.destinationFrame.y = i.y / r,
            this.destinationFrame.width = i.width / r,
            this.destinationFrame.height = i.height / r,
            e === i && this.sourceFrame.copyFrom(this.destinationFrame)
        }
        ,
        e.prototype.clear = function(t) {
            t = this.current ? t || this.current.baseTexture.clearColor : t || this.clearColor,
            this.renderer.framebuffer.clear(t[0], t[1], t[2], t[3])
        }
        ,
        e.prototype.resize = function() {
            this.bind(null)
        }
        ,
        e.prototype.reset = function() {
            this.bind(null)
        }
        ,
        e
    }(Ar)
      , Bn = function(t, e) {
        this.program = t,
        this.uniformData = e,
        this.uniformGroups = {}
    };
    Bn.prototype.destroy = function() {
        this.uniformData = null,
        this.uniformGroups = null,
        this.program = null
    }
    ;
    var Un = 0
      , kn = function(t) {
        function e(e) {
            t.call(this, e),
            this.systemCheck(),
            this.gl = null,
            this.shader = null,
            this.program = null,
            this.cache = {},
            this.id = Un++
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.systemCheck = function() {
            if (!Ot())
                throw new Error("Current environment does not allow unsafe-eval, please use @pixi/unsafe-eval module to enable support.")
        }
        ,
        e.prototype.contextChange = function(t) {
            this.gl = t,
            this.reset()
        }
        ,
        e.prototype.bind = function(t, e) {
            t.uniforms.globals = this.renderer.globalUniforms;
            var i = t.program
              , r = i.glPrograms[this.renderer.CONTEXT_UID] || this.generateShader(t);
            return this.shader = t,
            this.program !== i && (this.program = i,
            this.gl.useProgram(r.program)),
            e || this.syncUniformGroup(t.uniformGroup),
            r
        }
        ,
        e.prototype.setUniforms = function(t) {
            var e = this.shader.program
              , i = e.glPrograms[this.renderer.CONTEXT_UID];
            e.syncUniforms(i.uniformData, t, this.renderer)
        }
        ,
        e.prototype.syncUniformGroup = function(t) {
            var e = this.getglProgram();
            t.static && t.dirtyId === e.uniformGroups[t.id] || (e.uniformGroups[t.id] = t.dirtyId,
            this.syncUniforms(t, e))
        }
        ,
        e.prototype.syncUniforms = function(t, e) {
            (t.syncUniforms[this.shader.program.id] || this.createSyncGroups(t))(e.uniformData, t.uniforms, this.renderer)
        }
        ,
        e.prototype.createSyncGroups = function(t) {
            var e = this.getSignature(t, this.shader.program.uniformData);
            return this.cache[e] || (this.cache[e] = It(t, this.shader.program.uniformData)),
            t.syncUniforms[this.shader.program.id] = this.cache[e],
            t.syncUniforms[this.shader.program.id]
        }
        ,
        e.prototype.getSignature = function(t, e) {
            var i = t.uniforms
              , r = [];
            for (var n in i)
                r.push(n),
                e[n] && r.push(e[n].type);
            return r.join("-")
        }
        ,
        e.prototype.getglProgram = function() {
            return this.shader ? this.shader.program.glPrograms[this.renderer.CONTEXT_UID] : null
        }
        ,
        e.prototype.generateShader = function(t) {
            var e = this.gl
              , i = t.program
              , r = {};
            for (var n in i.attributeData)
                r[n] = i.attributeData[n].location;
            var o = mt(e, i.vertexSrc, i.fragmentSrc, r)
              , s = {};
            for (var a in i.uniformData) {
                var h = i.uniformData[a];
                s[a] = {
                    location: e.getUniformLocation(o, a),
                    value: _t(h.type, h.size)
                }
            }
            var u = new Bn(o,s);
            return i.glPrograms[this.renderer.CONTEXT_UID] = u,
            u
        }
        ,
        e.prototype.reset = function() {
            this.program = null,
            this.shader = null
        }
        ,
        e.prototype.destroy = function() {
            this.destroyed = !0
        }
        ,
        e
    }(Ar)
      , Xn = 0
      , jn = 1
      , Gn = 2
      , Hn = 3
      , zn = 4
      , Vn = function(t) {
        function e(e) {
            t.call(this, e),
            this.gl = null,
            this.stateId = 0,
            this.polygonOffset = 0,
            this.blendMode = ri.NONE,
            this._blendEq = !1,
            this.map = [],
            this.map[Xn] = this.setBlend,
            this.map[jn] = this.setOffset,
            this.map[Gn] = this.setCullFace,
            this.map[Hn] = this.setDepthTest,
            this.map[zn] = this.setFrontFace,
            this.checks = [],
            this.defaultState = new wn,
            this.defaultState.blend = !0,
            this.defaultState.depth = !0
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.contextChange = function(t) {
            this.gl = t,
            this.blendModes = Ct(t),
            this.set(this.defaultState),
            this.reset()
        }
        ,
        e.prototype.set = function(t) {
            if (t = t || this.defaultState,
            this.stateId !== t.data) {
                for (var e = this.stateId ^ t.data, i = 0; e; )
                    1 & e && this.map[i].call(this, !!(t.data & 1 << i)),
                    e >>= 1,
                    i++;
                this.stateId = t.data
            }
            for (var r = 0; r < this.checks.length; r++)
                this.checks[r](this, t)
        }
        ,
        e.prototype.forceState = function(t) {
            t = t || this.defaultState;
            for (var e = 0; e < this.map.length; e++)
                this.map[e].call(this, !!(t.data & 1 << e));
            for (var i = 0; i < this.checks.length; i++)
                this.checks[i](this, t);
            this.stateId = t.data
        }
        ,
        e.prototype.setBlend = function(t) {
            this.updateCheck(e.checkBlendMode, t),
            this.gl[t ? "enable" : "disable"](this.gl.BLEND)
        }
        ,
        e.prototype.setOffset = function(t) {
            this.updateCheck(e.checkPolygonOffset, t),
            this.gl[t ? "enable" : "disable"](this.gl.POLYGON_OFFSET_FILL)
        }
        ,
        e.prototype.setDepthTest = function(t) {
            this.gl[t ? "enable" : "disable"](this.gl.DEPTH_TEST)
        }
        ,
        e.prototype.setCullFace = function(t) {
            this.gl[t ? "enable" : "disable"](this.gl.CULL_FACE)
        }
        ,
        e.prototype.setFrontFace = function(t) {
            this.gl.frontFace(this.gl[t ? "CW" : "CCW"])
        }
        ,
        e.prototype.setBlendMode = function(t) {
            if (t !== this.blendMode) {
                this.blendMode = t;
                var e = this.blendModes[t]
                  , i = this.gl;
                2 === e.length ? i.blendFunc(e[0], e[1]) : i.blendFuncSeparate(e[0], e[1], e[2], e[3]),
                6 === e.length ? (this._blendEq = !0,
                i.blendEquationSeparate(e[4], e[5])) : this._blendEq && (this._blendEq = !1,
                i.blendEquationSeparate(i.FUNC_ADD, i.FUNC_ADD))
            }
        }
        ,
        e.prototype.setPolygonOffset = function(t, e) {
            this.gl.polygonOffset(t, e)
        }
        ,
        e.prototype.reset = function() {
            this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, !1),
            this.forceState(0),
            this._blendEq = !0,
            this.blendMode = -1,
            this.setBlendMode(0)
        }
        ,
        e.prototype.updateCheck = function(t, e) {
            var i = this.checks.indexOf(t);
            e && -1 === i ? this.checks.push(t) : e || -1 === i || this.checks.splice(i, 1)
        }
        ,
        e.checkBlendMode = function(t, e) {
            t.setBlendMode(e.blendMode)
        }
        ,
        e.checkPolygonOffset = function(t, e) {
            t.setPolygonOffset(e.polygonOffset, 0)
        }
        ,
        e
    }(Ar)
      , Yn = function(t) {
        function e(e) {
            t.call(this, e),
            this.count = 0,
            this.checkCount = 0,
            this.maxIdle = Ie.GC_MAX_IDLE,
            this.checkCountMax = Ie.GC_MAX_CHECK_COUNT,
            this.mode = Ie.GC_MODE
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.postrender = function() {
            this.count++,
            this.mode !== ci.MANUAL && ++this.checkCount > this.checkCountMax && (this.checkCount = 0,
            this.run())
        }
        ,
        e.prototype.run = function() {
            for (var t = this.renderer.texture, e = t.managedTextures, i = !1, r = 0; r < e.length; r++) {
                var n = e[r];
                !n.framebuffer && this.count - n.touched > this.maxIdle && (t.destroyTexture(n, !0),
                e[r] = null,
                i = !0)
            }
            if (i) {
                for (var o = 0, s = 0; s < e.length; s++)
                    null !== e[s] && (e[o++] = e[s]);
                e.length = o
            }
        }
        ,
        e.prototype.unload = function(t) {
            var e = this.renderer.textureSystem;
            t._texture && t._texture._glRenderTargets && e.destroyTexture(t._texture);
            for (var i = t.children.length - 1; i >= 0; i--)
                this.unload(t.children[i])
        }
        ,
        e
    }(Ar)
      , Wn = function(t) {
        this.texture = t,
        this.width = -1,
        this.height = -1,
        this.dirtyId = -1,
        this.dirtyStyleId = -1,
        this.mipmap = !1,
        this.wrapMode = 33071,
        this.type = 6408,
        this.internalFormat = 5121
    }
      , qn = function(t) {
        function e(e) {
            t.call(this, e),
            this.boundTextures = [],
            this.currentLocation = -1,
            this.managedTextures = [],
            this._unknownBoundTextures = !1,
            this.unknownTexture = new xr
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.contextChange = function() {
            var t = this.gl = this.renderer.gl;
            this.CONTEXT_UID = this.renderer.CONTEXT_UID,
            this.webGLVersion = this.renderer.context.webGLVersion;
            var e = t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS);
            this.boundTextures.length = e;
            for (var i = 0; i < e; i++)
                this.boundTextures[i] = null;
            this.emptyTextures = {};
            var r = new Wn(t.createTexture());
            t.bindTexture(t.TEXTURE_2D, r.texture),
            t.texImage2D(t.TEXTURE_2D, 0, t.RGBA, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, new Uint8Array(4)),
            this.emptyTextures[t.TEXTURE_2D] = r,
            this.emptyTextures[t.TEXTURE_CUBE_MAP] = new Wn(t.createTexture()),
            t.bindTexture(t.TEXTURE_CUBE_MAP, this.emptyTextures[t.TEXTURE_CUBE_MAP].texture);
            for (var n = 0; n < 6; n++)
                t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X + n, 0, t.RGBA, 1, 1, 0, t.RGBA, t.UNSIGNED_BYTE, null);
            t.texParameteri(t.TEXTURE_CUBE_MAP, t.TEXTURE_MAG_FILTER, t.LINEAR),
            t.texParameteri(t.TEXTURE_CUBE_MAP, t.TEXTURE_MIN_FILTER, t.LINEAR);
            for (var o = 0; o < this.boundTextures.length; o++)
                this.bind(null, o)
        }
        ,
        e.prototype.bind = function(t, e) {
            void 0 === e && (e = 0);
            var i = this
              , r = i.gl;
            if (t) {
                if (t = t.baseTexture || t,
                t.valid) {
                    t.touched = this.renderer.textureGC.count;
                    var n = t._glTextures[this.CONTEXT_UID] || this.initTexture(t);
                    this.currentLocation !== e && (this.currentLocation = e,
                    r.activeTexture(r.TEXTURE0 + e)),
                    this.boundTextures[e] !== t && r.bindTexture(t.target, n.texture),
                    n.dirtyId !== t.dirtyId && this.updateTexture(t),
                    this.boundTextures[e] = t
                }
            } else
                this.currentLocation !== e && (this.currentLocation = e,
                r.activeTexture(r.TEXTURE0 + e)),
                r.bindTexture(r.TEXTURE_2D, this.emptyTextures[r.TEXTURE_2D].texture),
                this.boundTextures[e] = null
        }
        ,
        e.prototype.reset = function() {
            this._unknownBoundTextures = !0,
            this.currentLocation = -1;
            for (var t = 0; t < this.boundTextures.length; t++)
                this.boundTextures[t] = this.unknownTexture
        }
        ,
        e.prototype.unbind = function(t) {
            var e = this
              , i = e.gl
              , r = e.boundTextures;
            if (this._unknownBoundTextures) {
                this._unknownBoundTextures = !1;
                for (var n = 0; n < r.length; n++)
                    r[n] === this.unknownTexture && this.bind(null, n)
            }
            for (var o = 0; o < r.length; o++)
                r[o] === t && (this.currentLocation !== o && (i.activeTexture(i.TEXTURE0 + o),
                this.currentLocation = o),
                i.bindTexture(i.TEXTURE_2D, this.emptyTextures[t.target].texture),
                r[o] = null)
        }
        ,
        e.prototype.initTexture = function(t) {
            var e = new Wn(this.gl.createTexture());
            return e.dirtyId = -1,
            t._glTextures[this.CONTEXT_UID] = e,
            this.managedTextures.push(t),
            t.on("dispose", this.destroyTexture, this),
            e
        }
        ,
        e.prototype.initTextureType = function(t, e) {
            if (e.internalFormat = t.format,
            e.type = t.type,
            2 === this.webGLVersion) {
                var i = this.renderer.gl;
                t.type === i.FLOAT && t.format === i.RGBA && (e.internalFormat = i.RGBA32F),
                t.type === ai.HALF_FLOAT && (e.type = i.HALF_FLOAT),
                e.type === i.HALF_FLOAT && t.format === i.RGBA && (e.internalFormat = i.RGBA16F)
            }
        }
        ,
        e.prototype.updateTexture = function(t) {
            var e = t._glTextures[this.CONTEXT_UID];
            if (e) {
                var i = this.renderer;
                if (this.initTextureType(t, e),
                t.resource && t.resource.upload(i, t, e))
                    ;
                else {
                    var r = t.realWidth
                      , n = t.realHeight
                      , o = i.gl;
                    (e.width !== r || e.height !== n || e.dirtyId < 0) && (e.width = r,
                    e.height = n,
                    o.texImage2D(t.target, 0, e.internalFormat, r, n, 0, t.format, e.type, null))
                }
                t.dirtyStyleId !== e.dirtyStyleId && this.updateTextureStyle(t),
                e.dirtyId = t.dirtyId
            }
        }
        ,
        e.prototype.destroyTexture = function(t, e) {
            var i = this
              , r = i.gl;
            if (t = t.baseTexture || t,
            t._glTextures[this.CONTEXT_UID] && (this.unbind(t),
            r.deleteTexture(t._glTextures[this.CONTEXT_UID].texture),
            t.off("dispose", this.destroyTexture, this),
            delete t._glTextures[this.CONTEXT_UID],
            !e)) {
                var n = this.managedTextures.indexOf(t);
                -1 !== n && $(this.managedTextures, n, 1)
            }
        }
        ,
        e.prototype.updateTextureStyle = function(t) {
            var e = t._glTextures[this.CONTEXT_UID];
            e && (t.mipmap !== li.POW2 && 2 === this.webGLVersion || t.isPowerOfTwo ? (e.mipmap = t.mipmap >= 1,
            e.wrapMode = t.wrapMode) : (e.mipmap = 0,
            e.wrapMode = ui.CLAMP),
            t.resource && t.resource.style(this.renderer, t, e) || this.setStyle(t, e),
            e.dirtyStyleId = t.dirtyStyleId)
        }
        ,
        e.prototype.setStyle = function(t, e) {
            var i = this.gl;
            if (e.mipmap && i.generateMipmap(t.target),
            i.texParameteri(t.target, i.TEXTURE_WRAP_S, e.wrapMode),
            i.texParameteri(t.target, i.TEXTURE_WRAP_T, e.wrapMode),
            e.mipmap) {
                i.texParameteri(t.target, i.TEXTURE_MIN_FILTER, t.scaleMode ? i.LINEAR_MIPMAP_LINEAR : i.NEAREST_MIPMAP_NEAREST);
                var r = this.renderer.context.extensions.anisotropicFiltering;
                if (r && t.anisotropicLevel > 0 && t.scaleMode === hi.LINEAR) {
                    var n = Math.min(t.anisotropicLevel, i.getParameter(r.MAX_TEXTURE_MAX_ANISOTROPY_EXT));
                    i.texParameterf(t.target, r.TEXTURE_MAX_ANISOTROPY_EXT, n)
                }
            } else
                i.texParameteri(t.target, i.TEXTURE_MIN_FILTER, t.scaleMode ? i.LINEAR : i.NEAREST);
            i.texParameteri(t.target, i.TEXTURE_MAG_FILTER, t.scaleMode ? i.LINEAR : i.NEAREST)
        }
        ,
        e
    }(Ar)
      , Zn = {
        FilterSystem: Jr,
        BatchSystem: $r,
        ContextSystem: nn,
        FramebufferSystem: on,
        GeometrySystem: hn,
        MaskSystem: Dn,
        StencilSystem: Rn,
        ProjectionSystem: Fn,
        RenderTextureSystem: Nn,
        ShaderSystem: kn,
        StateSystem: Vn,
        TextureGCSystem: Yn,
        TextureSystem: qn
    }
      , Kn = new Fi
      , Jn = function(t) {
        function e(e, i) {
            t.call(this),
            i = Object.assign({}, Ie.RENDER_OPTIONS, i),
            i.roundPixels && (Ie.ROUND_PIXELS = i.roundPixels,
            ct("5.0.0", "Renderer roundPixels option is deprecated, please use PIXI.settings.ROUND_PIXELS", 2)),
            this.options = i,
            this.type = ii.UNKNOWN,
            this.screen = new Yi(0,0,i.width,i.height),
            this.view = i.view || document.createElement("canvas"),
            this.resolution = i.resolution || Ie.RESOLUTION,
            this.transparent = i.transparent,
            this.autoDensity = i.autoDensity || i.autoResize || !1,
            this.preserveDrawingBuffer = i.preserveDrawingBuffer,
            this.clearBeforeRender = i.clearBeforeRender,
            this._backgroundColor = 0,
            this._backgroundColorRgba = [0, 0, 0, 0],
            this._backgroundColorString = "#000000",
            this.backgroundColor = i.backgroundColor || this._backgroundColor,
            this._tempDisplayObjectParent = new er,
            this._lastObjectRendered = this._tempDisplayObjectParent,
            this.plugins = {}
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            width: {
                configurable: !0
            },
            height: {
                configurable: !0
            },
            backgroundColor: {
                configurable: !0
            }
        };
        return e.prototype.initPlugins = function(t) {
            for (var e in t)
                this.plugins[e] = new t[e](this)
        }
        ,
        i.width.get = function() {
            return this.view.width
        }
        ,
        i.height.get = function() {
            return this.view.height
        }
        ,
        e.prototype.resize = function(t, e) {
            this.screen.width = t,
            this.screen.height = e,
            this.view.width = t * this.resolution,
            this.view.height = e * this.resolution,
            this.autoDensity && (this.view.style.width = t + "px",
            this.view.style.height = e + "px")
        }
        ,
        e.prototype.generateTexture = function(t, e, i, r) {
            r = r || t.getLocalBounds(),
            0 === r.width && (r.width = 1),
            0 === r.height && (r.height = 1);
            var n = Nr.create(0 | r.width, 0 | r.height, e, i);
            return Kn.tx = -r.x,
            Kn.ty = -r.y,
            this.render(t, n, !1, Kn, !!t.parent),
            n
        }
        ,
        e.prototype.destroy = function(t) {
            for (var e in this.plugins)
                this.plugins[e].destroy(),
                this.plugins[e] = null;
            t && this.view.parentNode && this.view.parentNode.removeChild(this.view),
            this.plugins = null,
            this.type = ii.UNKNOWN,
            this.view = null,
            this.screen = null,
            this.resolution = 0,
            this.transparent = !1,
            this.autoDensity = !1,
            this.blendModes = null,
            this.options = null,
            this.preserveDrawingBuffer = !1,
            this.clearBeforeRender = !1,
            this._backgroundColor = 0,
            this._backgroundColorRgba = null,
            this._backgroundColorString = null,
            this._tempDisplayObjectParent = null,
            this._lastObjectRendered = null
        }
        ,
        i.backgroundColor.get = function() {
            return this._backgroundColor
        }
        ,
        i.backgroundColor.set = function(t) {
            this._backgroundColor = t,
            this._backgroundColorString = V(t),
            z(t, this._backgroundColorRgba)
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Pe)
      , Qn = function(t) {
        function e(i) {
            void 0 === i && (i = {}),
            t.call(this, "WebGL", i),
            i = this.options,
            this.type = ii.WEBGL,
            this.gl = null,
            this.CONTEXT_UID = 0,
            this.runners = {
                destroy: new or("destroy"),
                contextChange: new or("contextChange",1),
                reset: new or("reset"),
                update: new or("update"),
                postrender: new or("postrender"),
                prerender: new or("prerender"),
                resize: new or("resize",2)
            },
            this.globalUniforms = new Zr({
                projectionMatrix: new Fi
            },!0),
            this.addSystem(Dn, "mask").addSystem(nn, "context").addSystem(Vn, "state").addSystem(kn, "shader").addSystem(qn, "texture").addSystem(hn, "geometry").addSystem(on, "framebuffer").addSystem(Rn, "stencil").addSystem(Fn, "projection").addSystem(Yn, "textureGC").addSystem(Jr, "filter").addSystem(Nn, "renderTexture").addSystem($r, "batch"),
            this.initPlugins(e.__plugins),
            i.context ? this.context.initFromContext(i.context) : this.context.initFromOptions({
                alpha: this.transparent,
                antialias: i.antialias,
                premultipliedAlpha: this.transparent && "notMultiplied" !== this.transparent,
                stencil: !0,
                preserveDrawingBuffer: i.preserveDrawingBuffer,
                powerPreference: this.options.powerPreference
            }),
            this.renderingToScreen = !0,
            G(2 === this.context.webGLVersion ? "WebGL 2" : "WebGL 1"),
            this.resize(this.options.width, this.options.height)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.create = function(t) {
            if (H())
                return new e(t);
            throw new Error('WebGL unsupported in this browser, use "pixi.js-legacy" for fallback canvas2d support.')
        }
        ,
        e.prototype.addSystem = function(t, e) {
            e || (e = t.name);
            var i = new t(this);
            if (this[e])
                throw new Error('Whoops! The name "' + e + '" is already in use');
            this[e] = i;
            for (var r in this.runners)
                this.runners[r].add(i);
            return this
        }
        ,
        e.prototype.render = function(t, e, i, r, n) {
            if (this.renderingToScreen = !e,
            this.runners.prerender.run(),
            this.emit("prerender"),
            this.projection.transform = r,
            !this.context.isLost) {
                if (e || (this._lastObjectRendered = t),
                !n) {
                    var o = t.parent;
                    t.parent = this._tempDisplayObjectParent,
                    t.updateTransform(),
                    t.parent = o
                }
                this.renderTexture.bind(e),
                this.batch.currentRenderer.start(),
                (void 0 !== i ? i : this.clearBeforeRender) && this.renderTexture.clear(),
                t.render(this),
                this.batch.currentRenderer.flush(),
                e && e.baseTexture.update(),
                this.runners.postrender.run(),
                this.projection.transform = null,
                this.emit("postrender")
            }
        }
        ,
        e.prototype.resize = function(e, i) {
            t.prototype.resize.call(this, e, i),
            this.runners.resize.run(e, i)
        }
        ,
        e.prototype.reset = function() {
            return this.runners.reset.run(),
            this
        }
        ,
        e.prototype.clear = function() {
            this.framebuffer.bind(),
            this.framebuffer.clear()
        }
        ,
        e.prototype.destroy = function(e) {
            this.runners.destroy.run();
            for (var i in this.runners)
                this.runners[i].destroy();
            t.prototype.destroy.call(this, e),
            this.gl = null
        }
        ,
        e.registerPlugin = function(t, i) {
            e.__plugins = e.__plugins || {},
            e.__plugins[t] = i
        }
        ,
        e
    }(Jn)
      , $n = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}"
      , to = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n    gl_Position = filterVertexPosition();\n    vTextureCoord = filterTextureCoord();\n}\n"
      , eo = function(t) {
        function e() {
            t.apply(this, arguments)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.from = function(t, i) {
            return new e(new wr(t,i))
        }
        ,
        e
    }(xr)
      , io = function() {
        this.textures = [],
        this.ids = [],
        this.blend = 0,
        this.textureCount = 0,
        this.start = 0,
        this.size = 0,
        this.type = 4
    }
      , ro = function(t) {
        this.rawBinaryData = new ArrayBuffer(t),
        this.uint32View = new Uint32Array(this.rawBinaryData),
        this.float32View = new Float32Array(this.rawBinaryData)
    }
      , no = {
        int8View: {
            configurable: !0
        },
        uint8View: {
            configurable: !0
        },
        int16View: {
            configurable: !0
        },
        uint16View: {
            configurable: !0
        },
        int32View: {
            configurable: !0
        }
    };
    no.int8View.get = function() {
        return this._int8View || (this._int8View = new Int8Array(this.rawBinaryData)),
        this._int8View
    }
    ,
    no.uint8View.get = function() {
        return this._uint8View || (this._uint8View = new Uint8Array(this.rawBinaryData)),
        this._uint8View
    }
    ,
    no.int16View.get = function() {
        return this._int16View || (this._int16View = new Int16Array(this.rawBinaryData)),
        this._int16View
    }
    ,
    no.uint16View.get = function() {
        return this._uint16View || (this._uint16View = new Uint16Array(this.rawBinaryData)),
        this._uint16View
    }
    ,
    no.int32View.get = function() {
        return this._int32View || (this._int32View = new Int32Array(this.rawBinaryData)),
        this._int32View
    }
    ,
    ro.prototype.view = function(t) {
        return this[t + "View"]
    }
    ,
    ro.prototype.destroy = function() {
        this.rawBinaryData = null,
        this._int8View = null,
        this._uint8View = null,
        this._int16View = null,
        this._uint16View = null,
        this._int32View = null,
        this.uint32View = null,
        this.float32View = null
    }
    ,
    ro.sizeOf = function(t) {
        switch (t) {
        case "int8":
        case "uint8":
            return 1;
        case "int16":
        case "uint16":
            return 2;
        case "int32":
        case "uint32":
        case "float32":
            return 4;
        default:
            throw new Error(t + " isn't a valid view type")
        }
    }
    ,
    Object.defineProperties(ro.prototype, no);
    var oo = function(t) {
        function e(e) {
            t.call(this, e),
            this.shaderGenerator = null,
            this.geometryClass = null,
            this.vertexSize = null,
            this.state = wn.for2d(),
            this.size = 8e3,
            this._vertexCount = 0,
            this._indexCount = 0,
            this._bufferedElements = [],
            this._bufferSize = 0,
            this._shader = null,
            this._packedGeometries = [],
            this._packedGeometryPoolSize = 2,
            this._flushId = 0,
            this._drawCalls = [];
            for (var i = 0; i < this.size / 4; i++)
                this._drawCalls[i] = new io;
            this._aBuffers = {},
            this._iBuffers = {},
            this.MAX_TEXTURES = 1,
            this.renderer.on("prerender", this.onPrerender, this),
            e.runners.contextChange.add(this)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.contextChange = function() {
            var t = this.renderer.gl;
            Ie.PREFER_ENV === ei.WEBGL_LEGACY ? this.MAX_TEXTURES = 1 : (this.MAX_TEXTURES = Math.min(t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS), Ie.SPRITE_MAX_TEXTURES),
            this.MAX_TEXTURES = Pt(this.MAX_TEXTURES, t)),
            this._shader = this.shaderGenerator.generateShader(this.MAX_TEXTURES);
            for (var e = 0; e < this._packedGeometryPoolSize; e++)
                this._packedGeometries[e] = new this.geometryClass
        }
        ,
        e.prototype.onPrerender = function() {
            this._flushId = 0
        }
        ,
        e.prototype.render = function(t) {
            t._texture.valid && (this._vertexCount + t.vertexData.length / 2 > this.size && this.flush(),
            this._vertexCount += t.vertexData.length / 2,
            this._indexCount += t.indices.length,
            this._bufferedElements[this._bufferSize++] = t)
        }
        ,
        e.prototype.flush = function() {
            if (0 !== this._vertexCount) {
                var t, e, i = this.getAttributeBuffer(this._vertexCount), r = this.getIndexBuffer(this._indexCount), n = this.renderer.gl, o = this, s = o._bufferedElements, a = o._drawCalls, h = o.MAX_TEXTURES, u = o._packedGeometries, l = o.vertexSize, c = this.renderer.textureGC.count, d = 0, p = 0, f = 0, v = a[0], g = 0, m = -1;
                v.textureCount = 0,
                v.start = 0,
                v.blend = m;
                var y, _ = ++xr._globalBatch;
                for (y = 0; y < this._bufferSize; ++y) {
                    var x = s[y];
                    s[y] = null,
                    t = x._texture.baseTexture;
                    var b = gi[t.premultiplyAlpha ? 1 : 0][x.blendMode];
                    m !== b && (m = b,
                    e = null,
                    f = h,
                    _++),
                    e !== t && (e = t,
                    t._batchEnabled !== _ && (f === h && (_++,
                    f = 0,
                    v.size = p - v.start,
                    v = a[g++],
                    v.textureCount = 0,
                    v.blend = m,
                    v.start = p),
                    t.touched = c,
                    t._batchEnabled = _,
                    t._id = f,
                    v.textures[v.textureCount++] = t,
                    f++)),
                    this.packInterleavedGeometry(x, i, r, d, p),
                    d += x.vertexData.length / 2 * l,
                    p += x.indices.length
                }
                xr._globalBatch = _,
                v.size = p - v.start,
                Ie.CAN_UPLOAD_SAME_BUFFER ? (u[this._flushId]._buffer.update(i.rawBinaryData, 0),
                u[this._flushId]._indexBuffer.update(r, 0),
                this.renderer.geometry.updateBuffers()) : (this._packedGeometryPoolSize <= this._flushId && (this._packedGeometryPoolSize++,
                u[this._flushId] = new this.geometryClass),
                u[this._flushId]._buffer.update(i.rawBinaryData, 0),
                u[this._flushId]._indexBuffer.update(r, 0),
                this.renderer.geometry.bind(u[this._flushId]),
                this.renderer.geometry.updateBuffers(),
                this._flushId++);
                var T = this.renderer.texture
                  , w = this.renderer.state;
                for (y = 0; y < g; y++) {
                    for (var E = a[y], S = E.textureCount, I = 0; I < S; I++)
                        T.bind(E.textures[I], I),
                        E.textures[I] = null;
                    w.setBlendMode(E.blend),
                    n.drawElements(E.type, E.size, n.UNSIGNED_SHORT, 2 * E.start)
                }
                this._bufferSize = 0,
                this._vertexCount = 0,
                this._indexCount = 0
            }
        }
        ,
        e.prototype.start = function() {
            this.renderer.state.set(this.state),
            this.renderer.shader.bind(this._shader),
            Ie.CAN_UPLOAD_SAME_BUFFER && this.renderer.geometry.bind(this._packedGeometries[this._flushId])
        }
        ,
        e.prototype.stop = function() {
            this.flush()
        }
        ,
        e.prototype.destroy = function() {
            for (var e = 0; e < this._packedGeometryPoolSize; e++)
                this._packedGeometries[e] && this._packedGeometries[e].destroy();
            this.renderer.off("prerender", this.onPrerender, this),
            this._aBuffers = null,
            this._iBuffers = null,
            this._packedGeometries = null,
            this._drawCalls = null,
            this._shader && (this._shader.destroy(),
            this._shader = null),
            t.prototype.destroy.call(this)
        }
        ,
        e.prototype.getAttributeBuffer = function(t) {
            var e = it(Math.ceil(t / 8))
              , i = nt(e)
              , r = 8 * e;
            this._aBuffers.length <= i && (this._iBuffers.length = i + 1);
            var n = this._aBuffers[r];
            return n || (this._aBuffers[r] = n = new ro(r * this.vertexSize * 4)),
            n
        }
        ,
        e.prototype.getIndexBuffer = function(t) {
            var e = it(Math.ceil(t / 12))
              , i = nt(e)
              , r = 12 * e;
            this._iBuffers.length <= i && (this._iBuffers.length = i + 1);
            var n = this._iBuffers[i];
            return n || (this._iBuffers[i] = n = new Uint16Array(r)),
            n
        }
        ,
        e.prototype.packInterleavedGeometry = function(t, e, i, r, n) {
            for (var o = e.uint32View, s = e.float32View, a = r / this.vertexSize, h = t.uvs, u = t.indices, l = t.vertexData, c = t._texture.baseTexture._id, d = Math.min(t.worldAlpha, 1), p = d < 1 && t._texture.baseTexture.premultiplyAlpha ? K(t._tintRGB, d) : t._tintRGB + (255 * d << 24), f = 0; f < l.length; f += 2)
                s[r++] = l[f],
                s[r++] = l[f + 1],
                s[r++] = h[f],
                s[r++] = h[f + 1],
                o[r++] = p,
                s[r++] = c;
            for (var v = 0; v < u.length; v++)
                i[n++] = a + u[v]
        }
        ,
        e
    }(Qr)
      , so = function(t, e) {
        if (this.vertexSrc = t,
        this.fragTemplate = e,
        this.programCache = {},
        this.defaultGroupCache = {},
        e.indexOf("%count%") < 0)
            throw new Error('Fragment template must contain "%count%".');
        if (e.indexOf("%forloop%") < 0)
            throw new Error('Fragment template must contain "%forloop%".')
    };
    so.prototype.generateShader = function(t) {
        if (!this.programCache[t]) {
            for (var e = new Int32Array(t), i = 0; i < t; i++)
                e[i] = i;
            this.defaultGroupCache[t] = Zr.from({
                uSamplers: e
            }, !0);
            var r = this.fragTemplate;
            r = r.replace(/%count%/gi, "" + t),
            r = r.replace(/%forloop%/gi, this.generateSampleSrc(t)),
            this.programCache[t] = new _n(this.vertexSrc,r)
        }
        var n = {
            tint: new Float32Array([1, 1, 1, 1]),
            translationMatrix: new Fi,
            default: this.defaultGroupCache[t]
        };
        return new bn(this.programCache[t],n)
    }
    ,
    so.prototype.generateSampleSrc = function(t) {
        var e = "";
        e += "\n",
        e += "\n";
        for (var i = 0; i < t; i++)
            i > 0 && (e += "\nelse "),
            i < t - 1 && (e += "if(vTextureId < " + i + ".5)"),
            e += "\n{",
            e += "\n\tcolor = texture2D(uSamplers[" + i + "], vTextureCoord);",
            e += "\n}";
        return e += "\n",
        e += "\n"
    }
    ;
    var ao = function(t) {
        function e(e) {
            void 0 === e && (e = !1),
            t.call(this),
            this._buffer = new Xr(null,e,!1),
            this._indexBuffer = new Xr(null,e,!0),
            this.addAttribute("aVertexPosition", this._buffer, 2, !1, ai.FLOAT).addAttribute("aTextureCoord", this._buffer, 2, !1, ai.FLOAT).addAttribute("aColor", this._buffer, 4, !0, ai.UNSIGNED_BYTE).addAttribute("aTextureId", this._buffer, 1, !0, ai.FLOAT).addIndex(this._indexBuffer)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e
    }(Vr)
      , ho = "precision highp float;\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\nattribute float aTextureId;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform vec4 tint;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vTextureId = aTextureId;\n    vColor = aColor * tint;\n}\n"
      , uo = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\nvarying float vTextureId;\nuniform sampler2D uSamplers[%count%];\n\nvoid main(void){\n    vec4 color;\n    %forloop%\n    gl_FragColor = color * vColor;\n}\n"
      , lo = function() {}
      , co = {
        defaultVertexSrc: {
            configurable: !0
        },
        defaultFragmentTemplate: {
            configurable: !0
        }
    };
    lo.create = function(t) {
        var e = Object.assign({
            vertex: ho,
            fragment: uo,
            geometryClass: ao,
            vertexSize: 6
        }, t)
          , i = e.vertex
          , r = e.fragment
          , n = e.vertexSize
          , o = e.geometryClass;
        return function(t) {
            function e(e) {
                t.call(this, e),
                this.shaderGenerator = new so(i,r),
                this.geometryClass = o,
                this.vertexSize = n
            }
            return t && (e.__proto__ = t),
            e.prototype = Object.create(t && t.prototype),
            e.prototype.constructor = e,
            e
        }(oo)
    }
    ,
    co.defaultVertexSrc.get = function() {
        return ho
    }
    ,
    co.defaultFragmentTemplate.get = function() {
        return uo
    }
    ,
    Object.defineProperties(lo, co);
    var po = lo.create()
      , fo = new Yi
      , vo = function(t) {
        this.renderer = t,
        t.extract = this
    };
    vo.prototype.image = function(t, e, i) {
        var r = new Image;
        return r.src = this.base64(t, e, i),
        r
    }
    ,
    vo.prototype.base64 = function(t, e, i) {
        return this.canvas(t).toDataURL(e, i)
    }
    ,
    vo.prototype.canvas = function(t) {
        var e, i, r, n = this.renderer, o = !1, s = !1;
        t && (t instanceof Nr ? r = t : (r = this.renderer.generateTexture(t),
        s = !0)),
        r ? (e = r.baseTexture.resolution,
        i = r.frame,
        o = !1,
        n.renderTexture.bind(r)) : (e = this.renderer.resolution,
        o = !0,
        i = fo,
        i.width = this.renderer.width,
        i.height = this.renderer.height,
        n.renderTexture.bind(null));
        var a = Math.floor(i.width * e)
          , h = Math.floor(i.height * e)
          , u = new bi(a,h,1)
          , l = new Uint8Array(4 * a * h)
          , c = n.gl;
        c.readPixels(i.x * e, i.y * e, a, h, c.RGBA, c.UNSIGNED_BYTE, l);
        var d = u.context.getImageData(0, 0, a, h);
        return vo.arrayPostDivide(l, d.data),
        u.context.putImageData(d, 0, 0),
        o && (u.context.scale(1, -1),
        u.context.drawImage(u.canvas, 0, -h)),
        s && r.destroy(!0),
        u.canvas
    }
    ,
    vo.prototype.pixels = function(t) {
        var e, i, r, n = this.renderer, o = !1;
        t && (t instanceof Nr ? r = t : (r = this.renderer.generateTexture(t),
        o = !0)),
        r ? (e = r.baseTexture.resolution,
        i = r.frame,
        n.renderTexture.bind(r)) : (e = n.resolution,
        i = fo,
        i.width = n.width,
        i.height = n.height,
        n.renderTexture.bind(null));
        var s = i.width * e
          , a = i.height * e
          , h = new Uint8Array(4 * s * a)
          , u = n.gl;
        return u.readPixels(i.x * e, i.y * e, s, a, u.RGBA, u.UNSIGNED_BYTE, h),
        o && r.destroy(!0),
        vo.arrayPostDivide(h, h),
        h
    }
    ,
    vo.prototype.destroy = function() {
        this.renderer.extract = null,
        this.renderer = null
    }
    ,
    vo.arrayPostDivide = function(t, e) {
        for (var i = 0; i < t.length; i += 4) {
            var r = e[i + 3] = t[i + 3];
            0 !== r ? (e[i] = Math.round(Math.min(255 * t[i] / r, 255)),
            e[i + 1] = Math.round(Math.min(255 * t[i + 1] / r, 255)),
            e[i + 2] = Math.round(Math.min(255 * t[i + 2] / r, 255))) : (e[i] = t[i],
            e[i + 1] = t[i + 1],
            e[i + 2] = t[i + 2])
        }
    }
    ;
    var go = {
        Extract: vo
    }
      , mo = function() {
        this.global = new Pi,
        this.target = null,
        this.originalEvent = null,
        this.identifier = null,
        this.isPrimary = !1,
        this.button = 0,
        this.buttons = 0,
        this.width = 0,
        this.height = 0,
        this.tiltX = 0,
        this.tiltY = 0,
        this.pointerType = null,
        this.pressure = 0,
        this.rotationAngle = 0,
        this.twist = 0,
        this.tangentialPressure = 0
    }
      , yo = {
        pointerId: {
            configurable: !0
        }
    };
    yo.pointerId.get = function() {
        return this.identifier
    }
    ,
    mo.prototype.getLocalPosition = function(t, e, i) {
        return t.worldTransform.applyInverse(i || this.global, e)
    }
    ,
    mo.prototype.copyEvent = function(t) {
        t.isPrimary && (this.isPrimary = !0),
        this.button = t.button,
        this.buttons = Number.isInteger(t.buttons) ? t.buttons : t.which,
        this.width = t.width,
        this.height = t.height,
        this.tiltX = t.tiltX,
        this.tiltY = t.tiltY,
        this.pointerType = t.pointerType,
        this.pressure = t.pressure,
        this.rotationAngle = t.rotationAngle,
        this.twist = t.twist || 0,
        this.tangentialPressure = t.tangentialPressure || 0
    }
    ,
    mo.prototype.reset = function() {
        this.isPrimary = !1
    }
    ,
    Object.defineProperties(mo.prototype, yo);
    var _o = function() {
        this.stopped = !1,
        this.stopsPropagatingAt = null,
        this.stopPropagationHint = !1,
        this.target = null,
        this.currentTarget = null,
        this.type = null,
        this.data = null
    };
    _o.prototype.stopPropagation = function() {
        this.stopped = !0,
        this.stopPropagationHint = !0,
        this.stopsPropagatingAt = this.currentTarget
    }
    ,
    _o.prototype.reset = function() {
        this.stopped = !1,
        this.stopsPropagatingAt = null,
        this.stopPropagationHint = !1,
        this.currentTarget = null,
        this.target = null
    }
    ;
    var xo = function t(e) {
        this._pointerId = e,
        this._flags = t.FLAGS.NONE
    }
      , bo = {
        pointerId: {
            configurable: !0
        },
        flags: {
            configurable: !0
        },
        none: {
            configurable: !0
        },
        over: {
            configurable: !0
        },
        rightDown: {
            configurable: !0
        },
        leftDown: {
            configurable: !0
        }
    };
    xo.prototype._doSet = function(t, e) {
        this._flags = e ? this._flags | t : this._flags & ~t
    }
    ,
    bo.pointerId.get = function() {
        return this._pointerId
    }
    ,
    bo.flags.get = function() {
        return this._flags
    }
    ,
    bo.flags.set = function(t) {
        this._flags = t
    }
    ,
    bo.none.get = function() {
        return this._flags === this.constructor.FLAGS.NONE
    }
    ,
    bo.over.get = function() {
        return 0 != (this._flags & this.constructor.FLAGS.OVER)
    }
    ,
    bo.over.set = function(t) {
        this._doSet(this.constructor.FLAGS.OVER, t)
    }
    ,
    bo.rightDown.get = function() {
        return 0 != (this._flags & this.constructor.FLAGS.RIGHT_DOWN)
    }
    ,
    bo.rightDown.set = function(t) {
        this._doSet(this.constructor.FLAGS.RIGHT_DOWN, t)
    }
    ,
    bo.leftDown.get = function() {
        return 0 != (this._flags & this.constructor.FLAGS.LEFT_DOWN)
    }
    ,
    bo.leftDown.set = function(t) {
        this._doSet(this.constructor.FLAGS.LEFT_DOWN, t)
    }
    ,
    Object.defineProperties(xo.prototype, bo),
    xo.FLAGS = Object.freeze({
        NONE: 0,
        OVER: 1,
        LEFT_DOWN: 2,
        RIGHT_DOWN: 4
    });
    var To = {
        interactive: !1,
        interactiveChildren: !0,
        hitArea: null,
        get buttonMode() {
            return "pointer" === this.cursor
        },
        set buttonMode(t) {
            t ? this.cursor = "pointer" : "pointer" === this.cursor && (this.cursor = null)
        },
        cursor: null,
        get trackedPointers() {
            return void 0 === this._trackedPointers && (this._trackedPointers = {}),
            this._trackedPointers
        },
        _trackedPointers: void 0
    };
    tr.mixin(To);
    var wo = 1
      , Eo = {
        target: null,
        data: {
            global: null
        }
    }
      , So = function(t) {
        function e(e, i) {
            t.call(this),
            i = i || {},
            this.renderer = e,
            this.autoPreventDefault = void 0 === i.autoPreventDefault || i.autoPreventDefault,
            this.interactionFrequency = i.interactionFrequency || 10,
            this.mouse = new mo,
            this.mouse.identifier = wo,
            this.mouse.global.set(-999999),
            this.activeInteractionData = {},
            this.activeInteractionData[wo] = this.mouse,
            this.interactionDataPool = [],
            this.eventData = new _o,
            this.interactionDOMElement = null,
            this.moveWhenInside = !1,
            this.eventsAdded = !1,
            this.mouseOverRenderer = !1,
            this.supportsTouchEvents = "ontouchstart"in window,
            this.supportsPointerEvents = !!window.PointerEvent,
            this.onPointerUp = this.onPointerUp.bind(this),
            this.processPointerUp = this.processPointerUp.bind(this),
            this.onPointerCancel = this.onPointerCancel.bind(this),
            this.processPointerCancel = this.processPointerCancel.bind(this),
            this.onPointerDown = this.onPointerDown.bind(this),
            this.processPointerDown = this.processPointerDown.bind(this),
            this.onPointerMove = this.onPointerMove.bind(this),
            this.processPointerMove = this.processPointerMove.bind(this),
            this.onPointerOut = this.onPointerOut.bind(this),
            this.processPointerOverOut = this.processPointerOverOut.bind(this),
            this.onPointerOver = this.onPointerOver.bind(this),
            this.cursorStyles = {
                default: "inherit",
                pointer: "pointer"
            },
            this.currentCursorMode = null,
            this.cursor = null,
            this._tempPoint = new Pi,
            this.resolution = 1,
            this.delayedEvents = [],
            this.setTargetElement(this.renderer.view, this.renderer.resolution)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.hitTest = function(t, e) {
            return Eo.target = null,
            Eo.data.global = t,
            e || (e = this.renderer._lastObjectRendered),
            this.processInteractive(Eo, e, null, !0),
            Eo.target
        }
        ,
        e.prototype.setTargetElement = function(t, e) {
            void 0 === e && (e = 1),
            this.removeEvents(),
            this.interactionDOMElement = t,
            this.resolution = e,
            this.addEvents()
        }
        ,
        e.prototype.addEvents = function() {
            this.interactionDOMElement && (ur.system.add(this.update, this, ar.INTERACTION),
            window.navigator.msPointerEnabled ? (this.interactionDOMElement.style["-ms-content-zooming"] = "none",
            this.interactionDOMElement.style["-ms-touch-action"] = "none") : this.supportsPointerEvents && (this.interactionDOMElement.style["touch-action"] = "none"),
            this.supportsPointerEvents ? (window.document.addEventListener("pointermove", this.onPointerMove, !0),
            this.interactionDOMElement.addEventListener("pointerdown", this.onPointerDown, !0),
            this.interactionDOMElement.addEventListener("pointerleave", this.onPointerOut, !0),
            this.interactionDOMElement.addEventListener("pointerover", this.onPointerOver, !0),
            window.addEventListener("pointercancel", this.onPointerCancel, !0),
            window.addEventListener("pointerup", this.onPointerUp, !0)) : (window.document.addEventListener("mousemove", this.onPointerMove, !0),
            this.interactionDOMElement.addEventListener("mousedown", this.onPointerDown, !0),
            this.interactionDOMElement.addEventListener("mouseout", this.onPointerOut, !0),
            this.interactionDOMElement.addEventListener("mouseover", this.onPointerOver, !0),
            window.addEventListener("mouseup", this.onPointerUp, !0)),
            this.supportsTouchEvents && (this.interactionDOMElement.addEventListener("touchstart", this.onPointerDown, !0),
            this.interactionDOMElement.addEventListener("touchcancel", this.onPointerCancel, !0),
            this.interactionDOMElement.addEventListener("touchend", this.onPointerUp, !0),
            this.interactionDOMElement.addEventListener("touchmove", this.onPointerMove, !0)),
            this.eventsAdded = !0)
        }
        ,
        e.prototype.removeEvents = function() {
            this.interactionDOMElement && (ur.system.remove(this.update, this),
            window.navigator.msPointerEnabled ? (this.interactionDOMElement.style["-ms-content-zooming"] = "",
            this.interactionDOMElement.style["-ms-touch-action"] = "") : this.supportsPointerEvents && (this.interactionDOMElement.style["touch-action"] = ""),
            this.supportsPointerEvents ? (window.document.removeEventListener("pointermove", this.onPointerMove, !0),
            this.interactionDOMElement.removeEventListener("pointerdown", this.onPointerDown, !0),
            this.interactionDOMElement.removeEventListener("pointerleave", this.onPointerOut, !0),
            this.interactionDOMElement.removeEventListener("pointerover", this.onPointerOver, !0),
            window.removeEventListener("pointercancel", this.onPointerCancel, !0),
            window.removeEventListener("pointerup", this.onPointerUp, !0)) : (window.document.removeEventListener("mousemove", this.onPointerMove, !0),
            this.interactionDOMElement.removeEventListener("mousedown", this.onPointerDown, !0),
            this.interactionDOMElement.removeEventListener("mouseout", this.onPointerOut, !0),
            this.interactionDOMElement.removeEventListener("mouseover", this.onPointerOver, !0),
            window.removeEventListener("mouseup", this.onPointerUp, !0)),
            this.supportsTouchEvents && (this.interactionDOMElement.removeEventListener("touchstart", this.onPointerDown, !0),
            this.interactionDOMElement.removeEventListener("touchcancel", this.onPointerCancel, !0),
            this.interactionDOMElement.removeEventListener("touchend", this.onPointerUp, !0),
            this.interactionDOMElement.removeEventListener("touchmove", this.onPointerMove, !0)),
            this.interactionDOMElement = null,
            this.eventsAdded = !1)
        }
        ,
        e.prototype.update = function(t) {
            if (this._deltaTime += t,
            !(this._deltaTime < this.interactionFrequency) && (this._deltaTime = 0,
            this.interactionDOMElement)) {
                if (this.didMove)
                    return void (this.didMove = !1);
                this.cursor = null;
                for (var e in this.activeInteractionData)
                    if (this.activeInteractionData.hasOwnProperty(e)) {
                        var i = this.activeInteractionData[e];
                        if (i.originalEvent && "touch" !== i.pointerType) {
                            var r = this.configureInteractionEventForDOMEvent(this.eventData, i.originalEvent, i);
                            this.processInteractive(r, this.renderer._lastObjectRendered, this.processPointerOverOut, !0)
                        }
                    }
                this.setCursorMode(this.cursor)
            }
        }
        ,
        e.prototype.setCursorMode = function(t) {
            if (t = t || "default",
            this.currentCursorMode !== t) {
                this.currentCursorMode = t;
                var e = this.cursorStyles[t];
                if (e)
                    switch (typeof e) {
                    case "string":
                        this.interactionDOMElement.style.cursor = e;
                        break;
                    case "function":
                        e(t);
                        break;
                    case "object":
                        Object.assign(this.interactionDOMElement.style, e)
                    }
                else
                    "string" != typeof t || Object.prototype.hasOwnProperty.call(this.cursorStyles, t) || (this.interactionDOMElement.style.cursor = t)
            }
        }
        ,
        e.prototype.dispatchEvent = function(t, e, i) {
            i.stopPropagationHint && t !== i.stopsPropagatingAt || (i.currentTarget = t,
            i.type = e,
            t.emit(e, i),
            t[e] && t[e](i))
        }
        ,
        e.prototype.delayDispatchEvent = function(t, e, i) {
            this.delayedEvents.push({
                displayObject: t,
                eventString: e,
                eventData: i
            })
        }
        ,
        e.prototype.mapPositionToPoint = function(t, e, i) {
            var r;
            r = this.interactionDOMElement.parentElement ? this.interactionDOMElement.getBoundingClientRect() : {
                x: 0,
                y: 0,
                width: 0,
                height: 0
            };
            var n = 1 / this.resolution;
            t.x = (e - r.left) * (this.interactionDOMElement.width / r.width) * n,
            t.y = (i - r.top) * (this.interactionDOMElement.height / r.height) * n
        }
        ,
        e.prototype.processInteractive = function(t, e, i, r, n, o) {
            if (!e || !e.visible)
                return !1;
            var s = t.data.global;
            n = e.interactive || n;
            var a = !1
              , h = n
              , u = !0;
            if (e.hitArea ? (r && (e.worldTransform.applyInverse(s, this._tempPoint),
            e.hitArea.contains(this._tempPoint.x, this._tempPoint.y) ? a = !0 : (r = !1,
            u = !1)),
            h = !1) : e._mask && r && (e._mask.containsPoint && e._mask.containsPoint(s) || (r = !1)),
            u && e.interactiveChildren && e.children)
                for (var l = e.children, c = l.length - 1; c >= 0; c--) {
                    var d = l[c]
                      , p = this.processInteractive(t, d, i, r, h, !0);
                    if (p) {
                        if (!d.parent)
                            continue;
                        h = !1,
                        p && (t.target && (r = !1),
                        a = !0)
                    }
                }
            n && (r && !t.target && !e.hitArea && e.containsPoint && e.containsPoint(s) && (a = !0),
            e.interactive && (a && !t.target && (t.target = e),
            i && i(t, e, !!a)));
            var f = this.delayedEvents;
            if (f.length && !o) {
                t.stopPropagationHint = !1;
                var v = f.length;
                this.delayedEvents = [];
                for (var g = 0; g < v; g++) {
                    var m = f[g]
                      , y = m.displayObject
                      , _ = m.eventString
                      , x = m.eventData;
                    x.stopsPropagatingAt === y && (x.stopPropagationHint = !0),
                    this.dispatchEvent(y, _, x)
                }
            }
            return a
        }
        ,
        e.prototype.onPointerDown = function(t) {
            if (!this.supportsTouchEvents || "touch" !== t.pointerType) {
                var e = this.normalizeToPointerData(t);
                if (this.autoPreventDefault && e[0].isNormalized) {
                    (t.cancelable || !("cancelable"in t)) && t.preventDefault()
                }
                for (var i = e.length, r = 0; r < i; r++) {
                    var n = e[r]
                      , o = this.getInteractionDataForPointerId(n)
                      , s = this.configureInteractionEventForDOMEvent(this.eventData, n, o);
                    if (s.data.originalEvent = t,
                    this.processInteractive(s, this.renderer._lastObjectRendered, this.processPointerDown, !0),
                    this.emit("pointerdown", s),
                    "touch" === n.pointerType)
                        this.emit("touchstart", s);
                    else if ("mouse" === n.pointerType || "pen" === n.pointerType) {
                        var a = 2 === n.button;
                        this.emit(a ? "rightdown" : "mousedown", this.eventData)
                    }
                }
            }
        }
        ,
        e.prototype.processPointerDown = function(t, e, i) {
            var r = t.data
              , n = t.data.identifier;
            if (i)
                if (e.trackedPointers[n] || (e.trackedPointers[n] = new xo(n)),
                this.dispatchEvent(e, "pointerdown", t),
                "touch" === r.pointerType)
                    this.dispatchEvent(e, "touchstart", t);
                else if ("mouse" === r.pointerType || "pen" === r.pointerType) {
                    var o = 2 === r.button;
                    o ? e.trackedPointers[n].rightDown = !0 : e.trackedPointers[n].leftDown = !0,
                    this.dispatchEvent(e, o ? "rightdown" : "mousedown", t)
                }
        }
        ,
        e.prototype.onPointerComplete = function(t, e, i) {
            for (var r = this.normalizeToPointerData(t), n = r.length, o = t.target !== this.interactionDOMElement ? "outside" : "", s = 0; s < n; s++) {
                var a = r[s]
                  , h = this.getInteractionDataForPointerId(a)
                  , u = this.configureInteractionEventForDOMEvent(this.eventData, a, h);
                if (u.data.originalEvent = t,
                this.processInteractive(u, this.renderer._lastObjectRendered, i, e || !o),
                this.emit(e ? "pointercancel" : "pointerup" + o, u),
                "mouse" === a.pointerType || "pen" === a.pointerType) {
                    var l = 2 === a.button;
                    this.emit(l ? "rightup" + o : "mouseup" + o, u)
                } else
                    "touch" === a.pointerType && (this.emit(e ? "touchcancel" : "touchend" + o, u),
                    this.releaseInteractionDataForPointerId(a.pointerId, h))
            }
        }
        ,
        e.prototype.onPointerCancel = function(t) {
            this.supportsTouchEvents && "touch" === t.pointerType || this.onPointerComplete(t, !0, this.processPointerCancel)
        }
        ,
        e.prototype.processPointerCancel = function(t, e) {
            var i = t.data
              , r = t.data.identifier;
            void 0 !== e.trackedPointers[r] && (delete e.trackedPointers[r],
            this.dispatchEvent(e, "pointercancel", t),
            "touch" === i.pointerType && this.dispatchEvent(e, "touchcancel", t))
        }
        ,
        e.prototype.onPointerUp = function(t) {
            this.supportsTouchEvents && "touch" === t.pointerType || this.onPointerComplete(t, !1, this.processPointerUp)
        }
        ,
        e.prototype.processPointerUp = function(t, e, i) {
            var r = t.data
              , n = t.data.identifier
              , o = e.trackedPointers[n]
              , s = "touch" === r.pointerType
              , a = "mouse" === r.pointerType || "pen" === r.pointerType
              , h = !1;
            if (a) {
                var u = 2 === r.button
                  , l = xo.FLAGS
                  , c = u ? l.RIGHT_DOWN : l.LEFT_DOWN
                  , d = void 0 !== o && o.flags & c;
                i ? (this.dispatchEvent(e, u ? "rightup" : "mouseup", t),
                d && (this.dispatchEvent(e, u ? "rightclick" : "click", t),
                h = !0)) : d && this.dispatchEvent(e, u ? "rightupoutside" : "mouseupoutside", t),
                o && (u ? o.rightDown = !1 : o.leftDown = !1)
            }
            i ? (this.dispatchEvent(e, "pointerup", t),
            s && this.dispatchEvent(e, "touchend", t),
            o && (a && !h || this.dispatchEvent(e, "pointertap", t),
            s && (this.dispatchEvent(e, "tap", t),
            o.over = !1))) : o && (this.dispatchEvent(e, "pointerupoutside", t),
            s && this.dispatchEvent(e, "touchendoutside", t)),
            o && o.none && delete e.trackedPointers[n]
        }
        ,
        e.prototype.onPointerMove = function(t) {
            if (!this.supportsTouchEvents || "touch" !== t.pointerType) {
                var e = this.normalizeToPointerData(t);
                "mouse" !== e[0].pointerType && "pen" !== e[0].pointerType || (this.didMove = !0,
                this.cursor = null);
                for (var i = e.length, r = 0; r < i; r++) {
                    var n = e[r]
                      , o = this.getInteractionDataForPointerId(n)
                      , s = this.configureInteractionEventForDOMEvent(this.eventData, n, o);
                    s.data.originalEvent = t,
                    this.processInteractive(s, this.renderer._lastObjectRendered, this.processPointerMove, !0),
                    this.emit("pointermove", s),
                    "touch" === n.pointerType && this.emit("touchmove", s),
                    "mouse" !== n.pointerType && "pen" !== n.pointerType || this.emit("mousemove", s)
                }
                "mouse" === e[0].pointerType && this.setCursorMode(this.cursor)
            }
        }
        ,
        e.prototype.processPointerMove = function(t, e, i) {
            var r = t.data
              , n = "touch" === r.pointerType
              , o = "mouse" === r.pointerType || "pen" === r.pointerType;
            o && this.processPointerOverOut(t, e, i),
            this.moveWhenInside && !i || (this.dispatchEvent(e, "pointermove", t),
            n && this.dispatchEvent(e, "touchmove", t),
            o && this.dispatchEvent(e, "mousemove", t))
        }
        ,
        e.prototype.onPointerOut = function(t) {
            if (!this.supportsTouchEvents || "touch" !== t.pointerType) {
                var e = this.normalizeToPointerData(t)
                  , i = e[0];
                "mouse" === i.pointerType && (this.mouseOverRenderer = !1,
                this.setCursorMode(null));
                var r = this.getInteractionDataForPointerId(i)
                  , n = this.configureInteractionEventForDOMEvent(this.eventData, i, r);
                n.data.originalEvent = i,
                this.processInteractive(n, this.renderer._lastObjectRendered, this.processPointerOverOut, !1),
                this.emit("pointerout", n),
                "mouse" === i.pointerType || "pen" === i.pointerType ? this.emit("mouseout", n) : this.releaseInteractionDataForPointerId(r.identifier)
            }
        }
        ,
        e.prototype.processPointerOverOut = function(t, e, i) {
            var r = t.data
              , n = t.data.identifier
              , o = "mouse" === r.pointerType || "pen" === r.pointerType
              , s = e.trackedPointers[n];
            i && !s && (s = e.trackedPointers[n] = new xo(n)),
            void 0 !== s && (i && this.mouseOverRenderer ? (s.over || (s.over = !0,
            this.delayDispatchEvent(e, "pointerover", t),
            o && this.delayDispatchEvent(e, "mouseover", t)),
            o && null === this.cursor && (this.cursor = e.cursor)) : s.over && (s.over = !1,
            this.dispatchEvent(e, "pointerout", this.eventData),
            o && this.dispatchEvent(e, "mouseout", t),
            s.none && delete e.trackedPointers[n]))
        }
        ,
        e.prototype.onPointerOver = function(t) {
            var e = this.normalizeToPointerData(t)
              , i = e[0]
              , r = this.getInteractionDataForPointerId(i)
              , n = this.configureInteractionEventForDOMEvent(this.eventData, i, r);
            n.data.originalEvent = i,
            "mouse" === i.pointerType && (this.mouseOverRenderer = !0),
            this.emit("pointerover", n),
            "mouse" !== i.pointerType && "pen" !== i.pointerType || this.emit("mouseover", n)
        }
        ,
        e.prototype.getInteractionDataForPointerId = function(t) {
            var e, i = t.pointerId;
            return i === wo || "mouse" === t.pointerType ? e = this.mouse : this.activeInteractionData[i] ? e = this.activeInteractionData[i] : (e = this.interactionDataPool.pop() || new mo,
            e.identifier = i,
            this.activeInteractionData[i] = e),
            e.copyEvent(t),
            e
        }
        ,
        e.prototype.releaseInteractionDataForPointerId = function(t) {
            var e = this.activeInteractionData[t];
            e && (delete this.activeInteractionData[t],
            e.reset(),
            this.interactionDataPool.push(e))
        }
        ,
        e.prototype.configureInteractionEventForDOMEvent = function(t, e, i) {
            return t.data = i,
            this.mapPositionToPoint(i.global, e.clientX, e.clientY),
            "touch" === e.pointerType && (e.globalX = i.global.x,
            e.globalY = i.global.y),
            i.originalEvent = e,
            t.reset(),
            t
        }
        ,
        e.prototype.normalizeToPointerData = function(t) {
            var e = [];
            if (this.supportsTouchEvents && t instanceof TouchEvent)
                for (var i = 0, r = t.changedTouches.length; i < r; i++) {
                    var n = t.changedTouches[i];
                    void 0 === n.button && (n.button = t.touches.length ? 1 : 0),
                    void 0 === n.buttons && (n.buttons = t.touches.length ? 1 : 0),
                    void 0 === n.isPrimary && (n.isPrimary = 1 === t.touches.length && "touchstart" === t.type),
                    void 0 === n.width && (n.width = n.radiusX || 1),
                    void 0 === n.height && (n.height = n.radiusY || 1),
                    void 0 === n.tiltX && (n.tiltX = 0),
                    void 0 === n.tiltY && (n.tiltY = 0),
                    void 0 === n.pointerType && (n.pointerType = "touch"),
                    void 0 === n.pointerId && (n.pointerId = n.identifier || 0),
                    void 0 === n.pressure && (n.pressure = n.force || .5),
                    void 0 === n.twist && (n.twist = 0),
                    void 0 === n.tangentialPressure && (n.tangentialPressure = 0),
                    void 0 === n.layerX && (n.layerX = n.offsetX = n.clientX),
                    void 0 === n.layerY && (n.layerY = n.offsetY = n.clientY),
                    n.isNormalized = !0,
                    e.push(n)
                }
            else
                !(t instanceof MouseEvent) || this.supportsPointerEvents && t instanceof window.PointerEvent ? e.push(t) : (void 0 === t.isPrimary && (t.isPrimary = !0),
                void 0 === t.width && (t.width = 1),
                void 0 === t.height && (t.height = 1),
                void 0 === t.tiltX && (t.tiltX = 0),
                void 0 === t.tiltY && (t.tiltY = 0),
                void 0 === t.pointerType && (t.pointerType = "mouse"),
                void 0 === t.pointerId && (t.pointerId = wo),
                void 0 === t.pressure && (t.pressure = .5),
                void 0 === t.twist && (t.twist = 0),
                void 0 === t.tangentialPressure && (t.tangentialPressure = 0),
                t.isNormalized = !0,
                e.push(t));
            return e
        }
        ,
        e.prototype.destroy = function() {
            this.removeEvents(),
            this.removeAllListeners(),
            this.renderer = null,
            this.mouse = null,
            this.eventData = null,
            this.interactionDOMElement = null,
            this.onPointerDown = null,
            this.processPointerDown = null,
            this.onPointerUp = null,
            this.processPointerUp = null,
            this.onPointerCancel = null,
            this.processPointerCancel = null,
            this.onPointerMove = null,
            this.processPointerMove = null,
            this.onPointerOut = null,
            this.processPointerOverOut = null,
            this.onPointerOver = null,
            this._tempPoint = null
        }
        ,
        e
    }(Pe)
      , Io = {
        InteractionData: mo,
        InteractionEvent: _o,
        InteractionManager: So,
        InteractionTrackingData: xo,
        interactiveTarget: To
    }
      , Po = {
        adaptive: !0,
        maxLength: 10,
        minSegments: 8,
        maxSegments: 2048,
        _segmentsCount: function(t, e) {
            if (void 0 === e && (e = 20),
            !this.adaptive)
                return e;
            var i = Math.ceil(t / this.maxLength);
            return i < this.minSegments ? i = this.minSegments : i > this.maxSegments && (i = this.maxSegments),
            i
        }
    }
      , Ao = function() {
        this.reset()
    };
    Ao.prototype.clone = function() {
        var t = new Ao;
        return t.color = this.color,
        t.alpha = this.alpha,
        t.texture = this.texture,
        t.matrix = this.matrix,
        t.visible = this.visible,
        t
    }
    ,
    Ao.prototype.reset = function() {
        this.color = 16777215,
        this.alpha = 1,
        this.texture = Lr.WHITE,
        this.matrix = null,
        this.visible = !1
    }
    ,
    Ao.prototype.destroy = function() {
        this.texture = null,
        this.matrix = null
    }
    ;
    var Oo = function(t, e, i, r) {
        void 0 === e && (e = null),
        void 0 === i && (i = null),
        void 0 === r && (r = null),
        this.shape = t,
        this.lineStyle = i,
        this.fillStyle = e,
        this.matrix = r,
        this.type = t.type,
        this.points = [],
        this.holes = []
    };
    Oo.prototype.clone = function() {
        return new Oo(this.shape,this.fillStyle,this.lineStyle,this.matrix)
    }
    ,
    Oo.prototype.destroy = function() {
        this.shape = null,
        this.holes.length = 0,
        this.holes = null,
        this.points.length = 0,
        this.points = null,
        this.lineStyle = null,
        this.fillStyle = null
    }
    ;
    var Co = {
        build: function(t) {
            var e, i, r = t.shape, n = t.points, o = r.x, s = r.y;
            if (n.length = 0,
            t.type === Ri.CIRC ? (e = r.radius,
            i = r.radius) : (e = r.width,
            i = r.height),
            0 !== e && 0 !== i) {
                var a = Math.floor(30 * Math.sqrt(r.radius)) || Math.floor(15 * Math.sqrt(r.width + r.height));
                a /= 2.3;
                for (var h = 2 * Math.PI / a, u = 0; u < a; u++)
                    n.push(o + Math.sin(-h * u) * e, s + Math.cos(-h * u) * i);
                n.push(n[0], n[1])
            }
        },
        triangulate: function(t, e) {
            var i = t.points
              , r = e.points
              , n = e.indices
              , o = r.length / 2
              , s = o;
            r.push(t.shape.x, t.shape.y);
            for (var a = 0; a < i.length; a += 2)
                r.push(i[a], i[a + 1]),
                n.push(o++, s, o)
        }
    }
      , Mo = {
        build: function(t) {
            t.points = t.shape.points.slice()
        },
        triangulate: function(t, e) {
            var i = t.points
              , r = t.holes
              , n = e.points
              , o = e.indices;
            if (i.length >= 6) {
                for (var s = [], a = 0; a < r.length; a++) {
                    var h = r[a];
                    s.push(i.length / 2),
                    i = i.concat(h.points)
                }
                var u = Ae(i, s, 2);
                if (!u)
                    return;
                for (var l = n.length / 2, c = 0; c < u.length; c += 3)
                    o.push(u[c] + l),
                    o.push(u[c + 1] + l),
                    o.push(u[c + 2] + l);
                for (var d = 0; d < i.length; d++)
                    n.push(i[d])
            }
        }
    }
      , Do = {
        build: function(t) {
            var e = t.shape
              , i = e.x
              , r = e.y
              , n = e.width
              , o = e.height
              , s = t.points;
            s.length = 0,
            s.push(i, r, i + n, r, i + n, r + o, i, r + o)
        },
        triangulate: function(t, e) {
            var i = t.points
              , r = e.points
              , n = r.length / 2;
            r.push(i[0], i[1], i[2], i[3], i[6], i[7], i[4], i[5]),
            e.indices.push(n, n + 1, n + 2, n + 1, n + 2, n + 3)
        }
    }
      , Ro = {
        build: function(t) {
            var e = t.shape
              , i = t.points
              , r = e.x
              , n = e.y
              , o = e.width
              , s = e.height
              , a = e.radius;
            i.length = 0,
            Nt(r, n + a, r, n, r + a, n, i),
            Nt(r + o - a, n, r + o, n, r + o, n + a, i),
            Nt(r + o, n + s - a, r + o, n + s, r + o - a, n + s, i),
            Nt(r + a, n + s, r, n + s, r, n + s - a, i)
        },
        triangulate: function(t, e) {
            for (var i = t.points, r = e.points, n = e.indices, o = r.length / 2, s = Ae(i, null, 2), a = 0, h = s.length; a < h; a += 3)
                n.push(s[a] + o),
                n.push(s[a + 1] + o),
                n.push(s[a + 2] + o);
            for (var u = 0, l = i.length; u < l; u++)
                r.push(i[u], i[++u])
        }
    }
      , Fo = []
      , Lo = []
      , No = new Pi
      , Bo = {};
    Bo[Ri.POLY] = Mo,
    Bo[Ri.CIRC] = Co,
    Bo[Ri.ELIP] = Co,
    Bo[Ri.RECT] = Do,
    Bo[Ri.RREC] = Ro;
    var Uo = function() {
        this.style = null,
        this.size = 0,
        this.start = 0,
        this.attribStart = 0,
        this.attribSize = 0
    }
      , ko = function(t) {
        function e() {
            t.call(this),
            this.points = [],
            this.colors = [],
            this.uvs = [],
            this.indices = [],
            this.textureIds = [],
            this.graphicsData = [],
            this.dirty = 0,
            this.batchDirty = -1,
            this.cacheDirty = -1,
            this.clearDirty = 0,
            this.drawCalls = [],
            this.batches = [],
            this.shapeIndex = 0,
            this._bounds = new $i,
            this.boundsDirty = -1,
            this.boundsPadding = 0,
            this.batchable = !1,
            this.indicesUint16 = null,
            this.uvsFloat32 = null,
            this.closePointEps = 1e-4
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            bounds: {
                configurable: !0
            }
        };
        return i.bounds.get = function() {
            return this.boundsDirty !== this.dirty && (this.boundsDirty = this.dirty,
            this.calculateBounds()),
            this._bounds
        }
        ,
        e.prototype.invalidate = function() {
            this.boundsDirty = -1,
            this.dirty++,
            this.batchDirty++,
            this.shapeIndex = 0,
            this.points.length = 0,
            this.colors.length = 0,
            this.uvs.length = 0,
            this.indices.length = 0,
            this.textureIds.length = 0;
            for (var t = 0; t < this.drawCalls.length; t++)
                this.drawCalls[t].textures.length = 0,
                Lo.push(this.drawCalls[t]);
            this.drawCalls.length = 0;
            for (var e = 0; e < this.batches.length; e++) {
                var i = this.batches[e];
                i.start = 0,
                i.attribStart = 0,
                i.style = null,
                Fo.push(i)
            }
            this.batches.length = 0
        }
        ,
        e.prototype.clear = function() {
            return this.graphicsData.length > 0 && (this.invalidate(),
            this.clearDirty++,
            this.graphicsData.length = 0),
            this
        }
        ,
        e.prototype.drawShape = function(t, e, i, r) {
            var n = new Oo(t,e,i,r);
            return this.graphicsData.push(n),
            this.dirty++,
            this
        }
        ,
        e.prototype.drawHole = function(t, e) {
            if (!this.graphicsData.length)
                return null;
            var i = new Oo(t,null,null,e)
              , r = this.graphicsData[this.graphicsData.length - 1];
            return i.lineStyle = r.lineStyle,
            r.holes.push(i),
            this.dirty++,
            this
        }
        ,
        e.prototype.destroy = function(e) {
            t.prototype.destroy.call(this, e);
            for (var i = 0; i < this.graphicsData.length; ++i)
                this.graphicsData[i].destroy();
            this.points.length = 0,
            this.points = null,
            this.colors.length = 0,
            this.colors = null,
            this.uvs.length = 0,
            this.uvs = null,
            this.indices.length = 0,
            this.indices = null,
            this.indexBuffer.destroy(),
            this.indexBuffer = null,
            this.graphicsData.length = 0,
            this.graphicsData = null,
            this.drawCalls.length = 0,
            this.drawCalls = null,
            this.batches.length = 0,
            this.batches = null,
            this._bounds = null
        }
        ,
        e.prototype.containsPoint = function(t) {
            for (var e = this.graphicsData, i = 0; i < e.length; ++i) {
                var r = e[i];
                if (r.fillStyle.visible && (r.shape && (r.matrix ? r.matrix.applyInverse(t, No) : No.copyFrom(t),
                r.shape.contains(No.x, No.y)))) {
                    if (r.holes)
                        for (var n = 0; n < r.holes.length; n++) {
                            var o = r.holes[n];
                            if (o.shape.contains(No.x, No.y))
                                return !1
                        }
                    return !0
                }
            }
            return !1
        }
        ,
        e.prototype.updateBatches = function() {
            if (this.dirty !== this.cacheDirty) {
                if (0 === this.graphicsData.length)
                    return void (this.batchable = !0);
                if (this.dirty !== this.cacheDirty)
                    for (var t = 0; t < this.graphicsData.length; t++) {
                        var e = this.graphicsData[t];
                        if (e.fillStyle && !e.fillStyle.texture.baseTexture.valid)
                            return;
                        if (e.lineStyle && !e.lineStyle.texture.baseTexture.valid)
                            return
                    }
                this.cacheDirty = this.dirty;
                var i = this.uvs
                  , r = null
                  , n = null
                  , o = 0
                  , s = !1;
                if (this.batches.length > 0) {
                    r = this.batches[this.batches.length - 1];
                    var a = r.style;
                    n = a.texture.baseTexture,
                    o = a.color + a.alpha,
                    s = !!a.native
                }
                for (var h = this.shapeIndex; h < this.graphicsData.length; h++) {
                    this.shapeIndex++;
                    var u = this.graphicsData[h]
                      , l = Bo[u.type]
                      , c = u.fillStyle
                      , d = u.lineStyle;
                    l.build(u),
                    u.matrix && this.transformPoints(u.points, u.matrix);
                    for (var p = 0; p < 2; p++) {
                        var f = 0 === p ? c : d;
                        if (f.visible) {
                            var v = f.texture.baseTexture
                              , g = this.indices.length
                              , m = this.points.length / 2;
                            !r || n === v && o === f.color + f.alpha && s === !!f.native || (r.size = g - r.start,
                            r.attribSize = m - r.attribStart,
                            r.size > 0 && (r = null)),
                            r || (r = Fo.pop() || new Uo,
                            this.batches.push(r),
                            v.wrapMode = ui.REPEAT,
                            n = v,
                            o = f.color + f.alpha,
                            s = f.native,
                            r.style = f,
                            r.start = g,
                            r.attribStart = m);
                            var y = this.points.length / 2;
                            if (0 === p)
                                u.holes.length ? (this.processHoles(u.holes),
                                Mo.triangulate(u, this)) : l.triangulate(u, this);
                            else {
                                Dt(u, this);
                                for (var _ = 0; _ < u.holes.length; _++)
                                    Dt(u.holes[_], this)
                            }
                            var x = this.points.length / 2 - y;
                            this.addUvs(this.points, i, f.texture, y, x, f.matrix)
                        }
                    }
                }
                var b = this.indices.length
                  , T = this.points.length / 2;
                if (!r)
                    return void (this.batchable = !0);
                if (r.size = b - r.start,
                r.attribSize = T - r.attribStart,
                this.indicesUint16 = new Uint16Array(this.indices),
                this.batchable = this.isBatchable(),
                this.batchable) {
                    this.batchDirty++,
                    this.uvsFloat32 = new Float32Array(this.uvs);
                    for (var w = 0; w < this.batches.length; w++)
                        for (var E = this.batches[w], S = 0; S < E.size; S++) {
                            var I = E.start + S;
                            this.indicesUint16[I] = this.indicesUint16[I] - E.attribStart
                        }
                } else
                    this.buildDrawCalls()
            }
        }
        ,
        e.prototype.isBatchable = function() {
            for (var t = this.batches, i = 0; i < t.length; i++)
                if (t[i].style.native)
                    return !1;
            return this.points.length < 2 * e.BATCHABLE_SIZE
        }
        ,
        e.prototype.buildDrawCalls = function() {
            for (var t = ++xr._globalBatch, e = 0; e < this.drawCalls.length; e++)
                this.drawCalls[e].textures.length = 0,
                Lo.push(this.drawCalls[e]);
            this.drawCalls.length = 0;
            var i = this.uvs
              , r = this.colors
              , n = this.textureIds
              , o = Lo.pop() || new io;
            o.textureCount = 0,
            o.start = 0,
            o.size = 0,
            o.type = ni.TRIANGLES;
            var s = 0
              , a = null
              , h = 0
              , u = !1
              , l = ni.TRIANGLES
              , c = 0;
            this.drawCalls.push(o);
            for (var d = 0; d < this.batches.length; d++) {
                var p = this.batches[d]
                  , f = p.style
                  , v = f.texture.baseTexture;
                u !== !!f.native && (u = f.native,
                l = u ? ni.LINES : ni.TRIANGLES,
                a = null,
                s = 8,
                t++),
                a !== v && (a = v,
                v._batchEnabled !== t && (8 === s && (t++,
                s = 0,
                o.size > 0 && (o = Lo.pop() || new io,
                this.drawCalls.push(o)),
                o.start = c,
                o.size = 0,
                o.textureCount = 0,
                o.type = l),
                v.touched = 1,
                v._batchEnabled = t,
                v._id = s,
                v.wrapMode = 10497,
                o.textures[o.textureCount++] = v,
                s++)),
                o.size += p.size,
                c += p.size,
                h = v._id,
                this.addColors(r, f.color, f.alpha, p.attribSize),
                this.addTextureIds(n, h, p.attribSize)
            }
            xr._globalBatch = t;
            for (var g = this.points, m = new ArrayBuffer(3 * g.length * 4), y = new Float32Array(m), _ = new Uint32Array(m), x = 0, b = 0; b < g.length / 2; b++)
                y[x++] = g[2 * b],
                y[x++] = g[2 * b + 1],
                y[x++] = i[2 * b],
                y[x++] = i[2 * b + 1],
                _[x++] = r[b],
                y[x++] = n[b];
            this._buffer.update(m),
            this._indexBuffer.update(this.indicesUint16)
        }
        ,
        e.prototype.processHoles = function(t) {
            for (var e = 0; e < t.length; e++) {
                var i = t[e];
                Bo[i.type].build(i),
                i.matrix && this.transformPoints(i.points, i.matrix)
            }
        }
        ,
        e.prototype.calculateBounds = function() {
            var t = 1 / 0
              , e = -1 / 0
              , i = 1 / 0
              , r = -1 / 0;
            if (this.graphicsData.length)
                for (var n = null, o = 0, s = 0, a = 0, h = 0, u = 0; u < this.graphicsData.length; u++) {
                    var l = this.graphicsData[u]
                      , c = l.type
                      , d = l.lineStyle ? l.lineStyle.width : 0;
                    if (n = l.shape,
                    c === Ri.RECT || c === Ri.RREC)
                        o = n.x - d / 2,
                        s = n.y - d / 2,
                        a = n.width + d,
                        h = n.height + d,
                        t = o < t ? o : t,
                        e = o + a > e ? o + a : e,
                        i = s < i ? s : i,
                        r = s + h > r ? s + h : r;
                    else if (c === Ri.CIRC)
                        o = n.x,
                        s = n.y,
                        a = n.radius + d / 2,
                        h = n.radius + d / 2,
                        t = o - a < t ? o - a : t,
                        e = o + a > e ? o + a : e,
                        i = s - h < i ? s - h : i,
                        r = s + h > r ? s + h : r;
                    else if (c === Ri.ELIP)
                        o = n.x,
                        s = n.y,
                        a = n.width + d / 2,
                        h = n.height + d / 2,
                        t = o - a < t ? o - a : t,
                        e = o + a > e ? o + a : e,
                        i = s - h < i ? s - h : i,
                        r = s + h > r ? s + h : r;
                    else
                        for (var p = n.points, f = 0, v = 0, g = 0, m = 0, y = 0, _ = 0, x = 0, b = 0, T = 0; T + 2 < p.length; T += 2)
                            o = p[T],
                            s = p[T + 1],
                            f = p[T + 2],
                            v = p[T + 3],
                            g = Math.abs(f - o),
                            m = Math.abs(v - s),
                            h = d,
                            (a = Math.sqrt(g * g + m * m)) < 1e-9 || (y = (h / a * m + g) / 2,
                            _ = (h / a * g + m) / 2,
                            x = (f + o) / 2,
                            b = (v + s) / 2,
                            t = x - y < t ? x - y : t,
                            e = x + y > e ? x + y : e,
                            i = b - _ < i ? b - _ : i,
                            r = b + _ > r ? b + _ : r)
                }
            else
                t = 0,
                e = 0,
                i = 0,
                r = 0;
            var w = this.boundsPadding;
            this._bounds.minX = t - w,
            this._bounds.maxX = e + w,
            this._bounds.minY = i - w,
            this._bounds.maxY = r + w
        }
        ,
        e.prototype.transformPoints = function(t, e) {
            for (var i = 0; i < t.length / 2; i++) {
                var r = t[2 * i]
                  , n = t[2 * i + 1];
                t[2 * i] = e.a * r + e.c * n + e.tx,
                t[2 * i + 1] = e.b * r + e.d * n + e.ty
            }
        }
        ,
        e.prototype.addColors = function(t, e, i, r) {
            for (var n = (e >> 16) + (65280 & e) + ((255 & e) << 16), o = K(n, i); r-- > 0; )
                t.push(o)
        }
        ,
        e.prototype.addTextureIds = function(t, e, i) {
            for (; i-- > 0; )
                t.push(e)
        }
        ,
        e.prototype.addUvs = function(t, e, i, r, n, o) {
            for (var s = 0, a = e.length, h = i.frame; s < n; ) {
                var u = t[2 * (r + s)]
                  , l = t[2 * (r + s) + 1];
                if (o) {
                    var c = o.a * u + o.c * l + o.tx;
                    l = o.b * u + o.d * l + o.ty,
                    u = c
                }
                s++,
                e.push(u / h.width, l / h.height)
            }
            var d = i.baseTexture;
            (h.width < d.width || h.height < d.height) && this.adjustUvs(e, i, a, n)
        }
        ,
        e.prototype.adjustUvs = function(t, e, i, r) {
            for (var n = e.baseTexture, o = i + 2 * r, s = e.frame, a = s.width / n.width, h = s.height / n.height, u = s.x / s.width, l = s.y / s.height, c = Math.floor(t[i] + 1e-6), d = Math.floor(t[i + 1] + 1e-6), p = i + 2; p < o; p += 2)
                c = Math.min(c, Math.floor(t[p] + 1e-6)),
                d = Math.min(d, Math.floor(t[p + 1] + 1e-6));
            u -= c,
            l -= d;
            for (var f = i; f < o; f += 2)
                t[f] = (t[f] + u) * a,
                t[f + 1] = (t[f + 1] + l) * h
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(ao);
    ko.BATCHABLE_SIZE = 100;
    var Xo = function(t) {
        function e() {
            t.apply(this, arguments)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.clone = function() {
            var t = new e;
            return t.color = this.color,
            t.alpha = this.alpha,
            t.texture = this.texture,
            t.matrix = this.matrix,
            t.visible = this.visible,
            t.width = this.width,
            t.alignment = this.alignment,
            t.native = this.native,
            t
        }
        ,
        e.prototype.reset = function() {
            t.prototype.reset.call(this),
            this.color = 0,
            this.width = 0,
            this.alignment = .5,
            this.native = !1
        }
        ,
        e
    }(Ao)
      , jo = function() {};
    jo.curveLength = function(t, e, i, r, n, o, s, a) {
        for (var h = 0, u = 0, l = 0, c = 0, d = 0, p = 0, f = 0, v = 0, g = 0, m = 0, y = 0, _ = t, x = e, b = 1; b <= 10; ++b)
            u = b / 10,
            l = u * u,
            c = l * u,
            d = 1 - u,
            p = d * d,
            f = p * d,
            v = f * t + 3 * p * u * i + 3 * d * l * n + c * s,
            g = f * e + 3 * p * u * r + 3 * d * l * o + c * a,
            m = _ - v,
            y = x - g,
            _ = v,
            x = g,
            h += Math.sqrt(m * m + y * y);
        return h
    }
    ,
    jo.curveTo = function(t, e, i, r, n, o, s) {
        var a = s[s.length - 2]
          , h = s[s.length - 1];
        s.length -= 2;
        var u = Po._segmentsCount(jo.curveLength(a, h, t, e, i, r, n, o))
          , l = 0
          , c = 0
          , d = 0
          , p = 0
          , f = 0;
        s.push(a, h);
        for (var v = 1, g = 0; v <= u; ++v)
            g = v / u,
            l = 1 - g,
            c = l * l,
            d = c * l,
            p = g * g,
            f = p * g,
            s.push(d * a + 3 * c * g * t + 3 * l * p * i + f * n, d * h + 3 * c * g * e + 3 * l * p * r + f * o)
    }
    ;
    var Go = function() {};
    Go.curveLength = function(t, e, i, r, n, o) {
        var s = t - 2 * i + n
          , a = e - 2 * r + o
          , h = 2 * i - 2 * t
          , u = 2 * r - 2 * e
          , l = 4 * (s * s + a * a)
          , c = 4 * (s * h + a * u)
          , d = h * h + u * u
          , p = 2 * Math.sqrt(l + c + d)
          , f = Math.sqrt(l)
          , v = 2 * l * f
          , g = 2 * Math.sqrt(d)
          , m = c / f;
        return (v * p + f * c * (p - g) + (4 * d * l - c * c) * Math.log((2 * f + m + p) / (m + g))) / (4 * v)
    }
    ,
    Go.curveTo = function(t, e, i, r, n) {
        for (var o = n[n.length - 2], s = n[n.length - 1], a = Po._segmentsCount(Go.curveLength(o, s, t, e, i, r)), h = 0, u = 0, l = 1; l <= a; ++l) {
            var c = l / a;
            h = o + (t - o) * c,
            u = s + (e - s) * c,
            n.push(h + (t + (i - t) * c - h) * c, u + (e + (r - e) * c - u) * c)
        }
    }
    ;
    var Ho = function() {};
    Ho.curveTo = function(t, e, i, r, n, o) {
        var s = o[o.length - 2]
          , a = o[o.length - 1]
          , h = a - e
          , u = s - t
          , l = r - e
          , c = i - t
          , d = Math.abs(h * c - u * l);
        if (d < 1e-8 || 0 === n)
            return o[o.length - 2] === t && o[o.length - 1] === e || o.push(t, e),
            null;
        var p = h * h + u * u
          , f = l * l + c * c
          , v = h * l + u * c
          , g = n * Math.sqrt(p) / d
          , m = n * Math.sqrt(f) / d
          , y = g * v / p
          , _ = m * v / f
          , x = g * c + m * u
          , b = g * l + m * h
          , T = u * (m + y)
          , w = h * (m + y)
          , E = c * (g + _)
          , S = l * (g + _);
        return {
            cx: x + t,
            cy: b + e,
            radius: n,
            startAngle: Math.atan2(w - b, T - x),
            endAngle: Math.atan2(S - b, E - x),
            anticlockwise: u * l > c * h
        }
    }
    ,
    Ho.arc = function(t, e, i, r, n, o, s, a, h) {
        for (var u = s - o, l = Po._segmentsCount(Math.abs(u) * n, 40 * Math.ceil(Math.abs(u) / Ci)), c = u / (2 * l), d = 2 * c, p = Math.cos(c), f = Math.sin(c), v = l - 1, g = v % 1 / v, m = 0; m <= v; ++m) {
            var y = m + g * m
              , _ = c + o + d * y
              , x = Math.cos(_)
              , b = -Math.sin(_);
            h.push((p * x + f * b) * n + i, (p * -b + f * x) * n + r)
        }
    }
    ;
    var zo = function(t) {
        function e(e, i, r, n, o, s) {
            o = o || n / 2;
            for (var a = -1 * Math.PI / 2 + s, h = 2 * r, u = Ci / h, l = [], c = 0; c < h; c++) {
                var d = c % 2 ? o : n
                  , p = c * u + a;
                l.push(e + d * Math.cos(p), i + d * Math.sin(p))
            }
            t.call(this, l)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e
    }(Ji)
      , Vo = new Float32Array(3)
      , Yo = {}
      , Wo = function(t) {
        function e(e) {
            void 0 === e && (e = null),
            t.call(this),
            this.geometry = e || new ko,
            this.geometry.refCount++,
            this.shader = null,
            this.state = wn.for2d(),
            this._fillStyle = new Ao,
            this._lineStyle = new Xo,
            this._matrix = null,
            this._holeMode = !1,
            this.currentPath = null,
            this.batches = [],
            this.batchTint = -1,
            this.vertexData = null,
            this._transformID = -1,
            this.batchDirty = -1,
            this.pluginName = "batch",
            this.tint = 16777215,
            this.blendMode = ri.NORMAL
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            blendMode: {
                configurable: !0
            },
            tint: {
                configurable: !0
            },
            fill: {
                configurable: !0
            },
            line: {
                configurable: !0
            }
        };
        return e.prototype.clone = function() {
            return this.finishPoly(),
            new e(this.geometry)
        }
        ,
        i.blendMode.set = function(t) {
            this.state.blendMode = t
        }
        ,
        i.blendMode.get = function() {
            return this.state.blendMode
        }
        ,
        i.tint.get = function() {
            return this._tint
        }
        ,
        i.tint.set = function(t) {
            this._tint = t
        }
        ,
        i.fill.get = function() {
            return this._fillStyle
        }
        ,
        i.line.get = function() {
            return this._lineStyle
        }
        ,
        e.prototype.lineStyle = function(t, e, i, r, n) {
            return void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            void 0 === i && (i = 1),
            void 0 === r && (r = .5),
            void 0 === n && (n = !1),
            this.lineTextureStyle(t, Lr.WHITE, e, i, null, r, n),
            this
        }
        ,
        e.prototype.lineTextureStyle = function(t, e, i, r, n, o, s) {
            void 0 === t && (t = 0),
            void 0 === e && (e = Lr.WHITE),
            void 0 === i && (i = 16777215),
            void 0 === r && (r = 1),
            void 0 === n && (n = null),
            void 0 === o && (o = .5),
            void 0 === s && (s = !1),
            this.currentPath && this.startPoly();
            var a = t > 0 && r > 0;
            return a ? (n && (n = n.clone(),
            n.invert()),
            Object.assign(this._lineStyle, {
                color: i,
                width: t,
                alpha: r,
                matrix: n,
                texture: e,
                alignment: o,
                native: s,
                visible: a
            })) : this._lineStyle.reset(),
            this
        }
        ,
        e.prototype.startPoly = function() {
            if (this.currentPath) {
                var t = this.currentPath.points
                  , e = this.currentPath.points.length;
                e > 2 && (this.drawShape(this.currentPath),
                this.currentPath = new Ji,
                this.currentPath.closeStroke = !1,
                this.currentPath.points.push(t[e - 2], t[e - 1]))
            } else
                this.currentPath = new Ji,
                this.currentPath.closeStroke = !1
        }
        ,
        e.prototype.finishPoly = function() {
            this.currentPath && (this.currentPath.points.length > 2 ? (this.drawShape(this.currentPath),
            this.currentPath = null) : this.currentPath.points.length = 0)
        }
        ,
        e.prototype.moveTo = function(t, e) {
            return this.startPoly(),
            this.currentPath.points[0] = t,
            this.currentPath.points[1] = e,
            this
        }
        ,
        e.prototype.lineTo = function(t, e) {
            this.currentPath || this.moveTo(0, 0);
            var i = this.currentPath.points
              , r = i[i.length - 2]
              , n = i[i.length - 1];
            return r === t && n === e || i.push(t, e),
            this
        }
        ,
        e.prototype._initCurve = function(t, e) {
            void 0 === t && (t = 0),
            void 0 === e && (e = 0),
            this.currentPath ? 0 === this.currentPath.points.length && (this.currentPath.points = [t, e]) : this.moveTo(t, e)
        }
        ,
        e.prototype.quadraticCurveTo = function(t, e, i, r) {
            this._initCurve();
            var n = this.currentPath.points;
            return 0 === n.length && this.moveTo(0, 0),
            Go.curveTo(t, e, i, r, n),
            this
        }
        ,
        e.prototype.bezierCurveTo = function(t, e, i, r, n, o) {
            return this._initCurve(),
            jo.curveTo(t, e, i, r, n, o, this.currentPath.points),
            this
        }
        ,
        e.prototype.arcTo = function(t, e, i, r, n) {
            this._initCurve(t, e);
            var o = this.currentPath.points
              , s = Ho.curveTo(t, e, i, r, n, o);
            if (s) {
                var a = s.cx
                  , h = s.cy
                  , u = s.radius
                  , l = s.startAngle
                  , c = s.endAngle
                  , d = s.anticlockwise;
                this.arc(a, h, u, l, c, d)
            }
            return this
        }
        ,
        e.prototype.arc = function(t, e, i, r, n, o) {
            if (void 0 === o && (o = !1),
            r === n)
                return this;
            if (!o && n <= r ? n += Ci : o && r <= n && (r += Ci),
            0 == n - r)
                return this;
            var s = t + Math.cos(r) * i
              , a = e + Math.sin(r) * i
              , h = this.geometry.closePointEps
              , u = this.currentPath ? this.currentPath.points : null;
            if (u) {
                var l = Math.abs(u[u.length - 2] - s)
                  , c = Math.abs(u[u.length - 1] - a);
                l < h && c < h || u.push(s, a)
            } else
                this.moveTo(s, a),
                u = this.currentPath.points;
            return Ho.arc(s, a, t, e, i, r, n, o, u),
            this
        }
        ,
        e.prototype.beginFill = function(t, e) {
            return void 0 === t && (t = 0),
            void 0 === e && (e = 1),
            this.beginTextureFill(Lr.WHITE, t, e)
        }
        ,
        e.prototype.beginTextureFill = function(t, e, i, r) {
            void 0 === t && (t = Lr.WHITE),
            void 0 === e && (e = 16777215),
            void 0 === i && (i = 1),
            void 0 === r && (r = null),
            this.currentPath && this.startPoly();
            var n = i > 0;
            return n ? (r && (r = r.clone(),
            r.invert()),
            Object.assign(this._fillStyle, {
                color: e,
                alpha: i,
                texture: t,
                matrix: r,
                visible: n
            })) : this._fillStyle.reset(),
            this
        }
        ,
        e.prototype.endFill = function() {
            return this.finishPoly(),
            this._fillStyle.reset(),
            this
        }
        ,
        e.prototype.drawRect = function(t, e, i, r) {
            return this.drawShape(new Yi(t,e,i,r))
        }
        ,
        e.prototype.drawRoundedRect = function(t, e, i, r, n) {
            return this.drawShape(new Qi(t,e,i,r,n))
        }
        ,
        e.prototype.drawCircle = function(t, e, i) {
            return this.drawShape(new Zi(t,e,i))
        }
        ,
        e.prototype.drawEllipse = function(t, e, i, r) {
            return this.drawShape(new Ki(t,e,i,r))
        }
        ,
        e.prototype.drawPolygon = function(t) {
            var e = arguments
              , i = t
              , r = !0;
            if (i.points && (r = i.closeStroke,
            i = i.points),
            !Array.isArray(i)) {
                i = new Array(arguments.length);
                for (var n = 0; n < i.length; ++n)
                    i[n] = e[n]
            }
            var o = new Ji(i);
            return o.closeStroke = r,
            this.drawShape(o),
            this
        }
        ,
        e.prototype.drawShape = function(t) {
            return this._holeMode ? this.geometry.drawHole(t, this._matrix) : this.geometry.drawShape(t, this._fillStyle.clone(), this._lineStyle.clone(), this._matrix),
            this
        }
        ,
        e.prototype.drawStar = function(t, e, i, r, n, o) {
            return void 0 === o && (o = 0),
            this.drawPolygon(new zo(t,e,i,r,n,o))
        }
        ,
        e.prototype.clear = function() {
            return this.geometry.clear(),
            this._lineStyle.reset(),
            this._fillStyle.reset(),
            this._matrix = null,
            this._holeMode = !1,
            this.currentPath = null,
            this
        }
        ,
        e.prototype.isFastRect = function() {
            return !1
        }
        ,
        e.prototype._render = function(t) {
            this.finishPoly();
            var e = this.geometry;
            e.updateBatches(),
            e.batchable ? (this.batchDirty !== e.batchDirty && this._populateBatches(),
            this._renderBatched(t)) : (t.batch.flush(),
            this._renderDirect(t))
        }
        ,
        e.prototype._populateBatches = function() {
            var t = this.geometry
              , e = this.blendMode;
            this.batches = [],
            this.batchTint = -1,
            this._transformID = -1,
            this.batchDirty = t.batchDirty,
            this.vertexData = new Float32Array(t.points);
            for (var i = 0, r = t.batches.length; i < r; i++) {
                var n = t.batches[i]
                  , o = n.style.color
                  , s = new Float32Array(this.vertexData.buffer,4 * n.attribStart * 2,2 * n.attribSize)
                  , a = new Float32Array(t.uvsFloat32.buffer,4 * n.attribStart * 2,2 * n.attribSize)
                  , h = new Uint16Array(t.indicesUint16.buffer,2 * n.start,n.size)
                  , u = {
                    vertexData: s,
                    blendMode: e,
                    indices: h,
                    uvs: a,
                    _batchRGB: z(o),
                    _tintRGB: o,
                    _texture: n.style.texture,
                    alpha: n.style.alpha,
                    worldAlpha: 1
                };
                this.batches[i] = u
            }
        }
        ,
        e.prototype._renderBatched = function(t) {
            if (this.batches.length) {
                t.batch.setObjectRenderer(t.plugins[this.pluginName]),
                this.calculateVertices(),
                this.calculateTints();
                for (var e = 0, i = this.batches.length; e < i; e++) {
                    var r = this.batches[e];
                    r.worldAlpha = this.worldAlpha * r.alpha,
                    t.plugins[this.pluginName].render(r)
                }
            }
        }
        ,
        e.prototype._renderDirect = function(t) {
            var e = this._resolveDirectShader(t)
              , i = this.geometry
              , r = this.tint
              , n = this.worldAlpha
              , o = e.uniforms
              , s = i.drawCalls;
            o.translationMatrix = this.transform.worldTransform,
            o.tint[0] = (r >> 16 & 255) / 255 * n,
            o.tint[1] = (r >> 8 & 255) / 255 * n,
            o.tint[2] = (255 & r) / 255 * n,
            o.tint[3] = n,
            t.shader.bind(e),
            t.geometry.bind(i, e),
            t.state.set(this.state);
            for (var a = 0, h = s.length; a < h; a++)
                this._renderDrawCallDirect(t, i.drawCalls[a])
        }
        ,
        e.prototype._renderDrawCallDirect = function(t, e) {
            for (var i = e.textureCount, r = 0; r < i; r++)
                t.texture.bind(e.textures[r], r);
            t.geometry.draw(e.type, e.size, e.start)
        }
        ,
        e.prototype._resolveDirectShader = function(t) {
            var e = this.shader
              , i = this.pluginName;
            if (!e) {
                if (!Yo[i]) {
                    for (var r = new Int32Array(16), n = 0; n < 16; n++)
                        r[n] = n;
                    var o = {
                        tint: new Float32Array([1, 1, 1, 1]),
                        translationMatrix: new Fi,
                        default: Zr.from({
                            uSamplers: r
                        }, !0)
                    }
                      , s = t.plugins[i]._shader.program;
                    Yo[i] = new bn(s,o)
                }
                e = Yo[i]
            }
            return e
        }
        ,
        e.prototype._calculateBounds = function() {
            this.finishPoly();
            var t = this.geometry.bounds;
            this._bounds.addFrame(this.transform, t.minX, t.minY, t.maxX, t.maxY)
        }
        ,
        e.prototype.containsPoint = function(t) {
            return this.worldTransform.applyInverse(t, e._TEMP_POINT),
            this.geometry.containsPoint(e._TEMP_POINT)
        }
        ,
        e.prototype.calculateTints = function() {
            if (this.batchTint !== this.tint) {
                this.batchTint = this.tint;
                for (var t = z(this.tint, Vo), e = 0; e < this.batches.length; e++) {
                    var i = this.batches[e]
                      , r = i._batchRGB
                      , n = t[0] * r[0] * 255
                      , o = t[1] * r[1] * 255
                      , s = t[2] * r[2] * 255
                      , a = (n << 16) + (o << 8) + (0 | s);
                    i._tintRGB = (a >> 16) + (65280 & a) + ((255 & a) << 16)
                }
            }
        }
        ,
        e.prototype.calculateVertices = function() {
            if (this._transformID !== this.transform._worldID) {
                this._transformID = this.transform._worldID;
                for (var t = this.transform.worldTransform, e = t.a, i = t.b, r = t.c, n = t.d, o = t.tx, s = t.ty, a = this.geometry.points, h = this.vertexData, u = 0, l = 0; l < a.length; l += 2) {
                    var c = a[l]
                      , d = a[l + 1];
                    h[u++] = e * c + r * d + o,
                    h[u++] = n * d + i * c + s
                }
            }
        }
        ,
        e.prototype.closePath = function() {
            var t = this.currentPath;
            return t && (t.closeStroke = !0),
            this
        }
        ,
        e.prototype.setMatrix = function(t) {
            return this._matrix = t,
            this
        }
        ,
        e.prototype.beginHole = function() {
            return this.finishPoly(),
            this._holeMode = !0,
            this
        }
        ,
        e.prototype.endHole = function() {
            return this.finishPoly(),
            this._holeMode = !1,
            this
        }
        ,
        e.prototype.destroy = function(e) {
            t.prototype.destroy.call(this, e),
            this.geometry.refCount--,
            0 === this.geometry.refCount && this.geometry.dispose(),
            this._matrix = null,
            this.currentPath = null,
            this._lineStyle.destroy(),
            this._lineStyle = null,
            this._fillStyle.destroy(),
            this._fillStyle = null,
            this.geometry = null,
            this.shader = null,
            this.vertexData = null,
            this.batches.length = 0,
            this.batches = null,
            t.prototype.destroy.call(this, e)
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(er);
    Wo._TEMP_POINT = new Pi;
    var qo = new Pi
      , Zo = new Uint16Array([0, 1, 2, 0, 2, 3])
      , Ko = function(t) {
        function e(e) {
            t.call(this),
            this._anchor = new Ai(this._onAnchorUpdate,this,e ? e.defaultAnchor.x : 0,e ? e.defaultAnchor.y : 0),
            this._texture = null,
            this._width = 0,
            this._height = 0,
            this._tint = null,
            this._tintRGB = null,
            this.tint = 16777215,
            this.blendMode = ri.NORMAL,
            this.shader = null,
            this._cachedTint = 16777215,
            this.uvs = null,
            this.texture = e || Lr.EMPTY,
            this.vertexData = new Float32Array(8),
            this.vertexTrimmedData = null,
            this._transformID = -1,
            this._textureID = -1,
            this._transformTrimmedID = -1,
            this._textureTrimmedID = -1,
            this.indices = Zo,
            this.size = 4,
            this.start = 0,
            this.pluginName = "batch",
            this.isSprite = !0,
            this._roundPixels = Ie.ROUND_PIXELS
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            roundPixels: {
                configurable: !0
            },
            width: {
                configurable: !0
            },
            height: {
                configurable: !0
            },
            anchor: {
                configurable: !0
            },
            tint: {
                configurable: !0
            },
            texture: {
                configurable: !0
            }
        };
        return e.prototype._onTextureUpdate = function() {
            this._textureID = -1,
            this._textureTrimmedID = -1,
            this._cachedTint = 16777215,
            this._width && (this.scale.x = et(this.scale.x) * this._width / this._texture.orig.width),
            this._height && (this.scale.y = et(this.scale.y) * this._height / this._texture.orig.height)
        }
        ,
        e.prototype._onAnchorUpdate = function() {
            this._transformID = -1,
            this._transformTrimmedID = -1
        }
        ,
        e.prototype.calculateVertices = function() {
            var t = this._texture;
            if (this._transformID !== this.transform._worldID || this._textureID !== t._updateID) {
                this._textureID !== t._updateID && (this.uvs = this._texture._uvs.uvsFloat32),
                this._transformID = this.transform._worldID,
                this._textureID = t._updateID;
                var e = this.transform.worldTransform
                  , i = e.a
                  , r = e.b
                  , n = e.c
                  , o = e.d
                  , s = e.tx
                  , a = e.ty
                  , h = this.vertexData
                  , u = t.trim
                  , l = t.orig
                  , c = this._anchor
                  , d = 0
                  , p = 0
                  , f = 0
                  , v = 0;
                if (u ? (p = u.x - c._x * l.width,
                d = p + u.width,
                v = u.y - c._y * l.height,
                f = v + u.height) : (p = -c._x * l.width,
                d = p + l.width,
                v = -c._y * l.height,
                f = v + l.height),
                h[0] = i * p + n * v + s,
                h[1] = o * v + r * p + a,
                h[2] = i * d + n * v + s,
                h[3] = o * v + r * d + a,
                h[4] = i * d + n * f + s,
                h[5] = o * f + r * d + a,
                h[6] = i * p + n * f + s,
                h[7] = o * f + r * p + a,
                this._roundPixels)
                    for (var g = 0; g < 8; g++)
                        h[g] = Math.round(h[g])
            }
        }
        ,
        e.prototype.calculateTrimmedVertices = function() {
            if (this.vertexTrimmedData) {
                if (this._transformTrimmedID === this.transform._worldID && this._textureTrimmedID === this._texture._updateID)
                    return
            } else
                this.vertexTrimmedData = new Float32Array(8);
            this._transformTrimmedID = this.transform._worldID,
            this._textureTrimmedID = this._texture._updateID;
            var t = this._texture
              , e = this.vertexTrimmedData
              , i = t.orig
              , r = this._anchor
              , n = this.transform.worldTransform
              , o = n.a
              , s = n.b
              , a = n.c
              , h = n.d
              , u = n.tx
              , l = n.ty
              , c = -r._x * i.width
              , d = c + i.width
              , p = -r._y * i.height
              , f = p + i.height;
            e[0] = o * c + a * p + u,
            e[1] = h * p + s * c + l,
            e[2] = o * d + a * p + u,
            e[3] = h * p + s * d + l,
            e[4] = o * d + a * f + u,
            e[5] = h * f + s * d + l,
            e[6] = o * c + a * f + u,
            e[7] = h * f + s * c + l
        }
        ,
        e.prototype._render = function(t) {
            this.calculateVertices(),
            t.batch.setObjectRenderer(t.plugins[this.pluginName]),
            t.plugins[this.pluginName].render(this)
        }
        ,
        e.prototype._calculateBounds = function() {
            var t = this._texture.trim
              , e = this._texture.orig;
            !t || t.width === e.width && t.height === e.height ? (this.calculateVertices(),
            this._bounds.addQuad(this.vertexData)) : (this.calculateTrimmedVertices(),
            this._bounds.addQuad(this.vertexTrimmedData))
        }
        ,
        e.prototype.getLocalBounds = function(e) {
            return 0 === this.children.length ? (this._bounds.minX = this._texture.orig.width * -this._anchor._x,
            this._bounds.minY = this._texture.orig.height * -this._anchor._y,
            this._bounds.maxX = this._texture.orig.width * (1 - this._anchor._x),
            this._bounds.maxY = this._texture.orig.height * (1 - this._anchor._y),
            e || (this._localBoundsRect || (this._localBoundsRect = new Yi),
            e = this._localBoundsRect),
            this._bounds.getRectangle(e)) : t.prototype.getLocalBounds.call(this, e)
        }
        ,
        e.prototype.containsPoint = function(t) {
            this.worldTransform.applyInverse(t, qo);
            var e = this._texture.orig.width
              , i = this._texture.orig.height
              , r = -e * this.anchor.x
              , n = 0;
            return qo.x >= r && qo.x < r + e && (n = -i * this.anchor.y,
            qo.y >= n && qo.y < n + i)
        }
        ,
        e.prototype.destroy = function(e) {
            if (t.prototype.destroy.call(this, e),
            this._texture.off("update", this._onTextureUpdate, this),
            this._anchor = null,
            "boolean" == typeof e ? e : e && e.texture) {
                var i = "boolean" == typeof e ? e : e && e.baseTexture;
                this._texture.destroy(!!i)
            }
            this._texture = null,
            this.shader = null
        }
        ,
        e.from = function(t, i) {
            return new e(t instanceof Lr ? t : Lr.from(t, i))
        }
        ,
        i.roundPixels.set = function(t) {
            this._roundPixels !== t && (this._transformID = -1),
            this._roundPixels = t
        }
        ,
        i.roundPixels.get = function() {
            return this._roundPixels
        }
        ,
        i.width.get = function() {
            return Math.abs(this.scale.x) * this._texture.orig.width
        }
        ,
        i.width.set = function(t) {
            var e = et(this.scale.x) || 1;
            this.scale.x = e * t / this._texture.orig.width,
            this._width = t
        }
        ,
        i.height.get = function() {
            return Math.abs(this.scale.y) * this._texture.orig.height
        }
        ,
        i.height.set = function(t) {
            var e = et(this.scale.y) || 1;
            this.scale.y = e * t / this._texture.orig.height,
            this._height = t
        }
        ,
        i.anchor.get = function() {
            return this._anchor
        }
        ,
        i.anchor.set = function(t) {
            this._anchor.copyFrom(t)
        }
        ,
        i.tint.get = function() {
            return this._tint
        }
        ,
        i.tint.set = function(t) {
            this._tint = t,
            this._tintRGB = (t >> 16) + (65280 & t) + ((255 & t) << 16)
        }
        ,
        i.texture.get = function() {
            return this._texture
        }
        ,
        i.texture.set = function(t) {
            this._texture !== t && (this._texture = t || Lr.EMPTY,
            this._cachedTint = 16777215,
            this._textureID = -1,
            this._textureTrimmedID = -1,
            t && (t.baseTexture.valid ? this._onTextureUpdate() : t.once("update", this._onTextureUpdate, this)))
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(er)
      , Jo = {
        LINEAR_VERTICAL: 0,
        LINEAR_HORIZONTAL: 1
    }
      , Qo = {
        align: "left",
        breakWords: !1,
        dropShadow: !1,
        dropShadowAlpha: 1,
        dropShadowAngle: Math.PI / 6,
        dropShadowBlur: 0,
        dropShadowColor: "black",
        dropShadowDistance: 5,
        fill: "black",
        fillGradientType: Jo.LINEAR_VERTICAL,
        fillGradientStops: [],
        fontFamily: "Arial",
        fontSize: 26,
        fontStyle: "normal",
        fontVariant: "normal",
        fontWeight: "normal",
        letterSpacing: 0,
        lineHeight: 0,
        lineJoin: "miter",
        miterLimit: 10,
        padding: 0,
        stroke: "black",
        strokeThickness: 0,
        textBaseline: "alphabetic",
        trim: !1,
        whiteSpace: "pre",
        wordWrap: !1,
        wordWrapWidth: 100,
        leading: 0
    }
      , $o = ["serif", "sans-serif", "monospace", "cursive", "fantasy", "system-ui"]
      , ts = function(t) {
        this.styleID = 0,
        this.reset(),
        Xt(this, t, t)
    }
      , es = {
        align: {
            configurable: !0
        },
        breakWords: {
            configurable: !0
        },
        dropShadow: {
            configurable: !0
        },
        dropShadowAlpha: {
            configurable: !0
        },
        dropShadowAngle: {
            configurable: !0
        },
        dropShadowBlur: {
            configurable: !0
        },
        dropShadowColor: {
            configurable: !0
        },
        dropShadowDistance: {
            configurable: !0
        },
        fill: {
            configurable: !0
        },
        fillGradientType: {
            configurable: !0
        },
        fillGradientStops: {
            configurable: !0
        },
        fontFamily: {
            configurable: !0
        },
        fontSize: {
            configurable: !0
        },
        fontStyle: {
            configurable: !0
        },
        fontVariant: {
            configurable: !0
        },
        fontWeight: {
            configurable: !0
        },
        letterSpacing: {
            configurable: !0
        },
        lineHeight: {
            configurable: !0
        },
        leading: {
            configurable: !0
        },
        lineJoin: {
            configurable: !0
        },
        miterLimit: {
            configurable: !0
        },
        padding: {
            configurable: !0
        },
        stroke: {
            configurable: !0
        },
        strokeThickness: {
            configurable: !0
        },
        textBaseline: {
            configurable: !0
        },
        trim: {
            configurable: !0
        },
        whiteSpace: {
            configurable: !0
        },
        wordWrap: {
            configurable: !0
        },
        wordWrapWidth: {
            configurable: !0
        }
    };
    ts.prototype.clone = function() {
        var t = {};
        return Xt(t, this, Qo),
        new ts(t)
    }
    ,
    ts.prototype.reset = function() {
        Xt(this, Qo, Qo)
    }
    ,
    es.align.get = function() {
        return this._align
    }
    ,
    es.align.set = function(t) {
        this._align !== t && (this._align = t,
        this.styleID++)
    }
    ,
    es.breakWords.get = function() {
        return this._breakWords
    }
    ,
    es.breakWords.set = function(t) {
        this._breakWords !== t && (this._breakWords = t,
        this.styleID++)
    }
    ,
    es.dropShadow.get = function() {
        return this._dropShadow
    }
    ,
    es.dropShadow.set = function(t) {
        this._dropShadow !== t && (this._dropShadow = t,
        this.styleID++)
    }
    ,
    es.dropShadowAlpha.get = function() {
        return this._dropShadowAlpha
    }
    ,
    es.dropShadowAlpha.set = function(t) {
        this._dropShadowAlpha !== t && (this._dropShadowAlpha = t,
        this.styleID++)
    }
    ,
    es.dropShadowAngle.get = function() {
        return this._dropShadowAngle
    }
    ,
    es.dropShadowAngle.set = function(t) {
        this._dropShadowAngle !== t && (this._dropShadowAngle = t,
        this.styleID++)
    }
    ,
    es.dropShadowBlur.get = function() {
        return this._dropShadowBlur
    }
    ,
    es.dropShadowBlur.set = function(t) {
        this._dropShadowBlur !== t && (this._dropShadowBlur = t,
        this.styleID++)
    }
    ,
    es.dropShadowColor.get = function() {
        return this._dropShadowColor
    }
    ,
    es.dropShadowColor.set = function(t) {
        var e = Ut(t);
        this._dropShadowColor !== e && (this._dropShadowColor = e,
        this.styleID++)
    }
    ,
    es.dropShadowDistance.get = function() {
        return this._dropShadowDistance
    }
    ,
    es.dropShadowDistance.set = function(t) {
        this._dropShadowDistance !== t && (this._dropShadowDistance = t,
        this.styleID++)
    }
    ,
    es.fill.get = function() {
        return this._fill
    }
    ,
    es.fill.set = function(t) {
        var e = Ut(t);
        this._fill !== e && (this._fill = e,
        this.styleID++)
    }
    ,
    es.fillGradientType.get = function() {
        return this._fillGradientType
    }
    ,
    es.fillGradientType.set = function(t) {
        this._fillGradientType !== t && (this._fillGradientType = t,
        this.styleID++)
    }
    ,
    es.fillGradientStops.get = function() {
        return this._fillGradientStops
    }
    ,
    es.fillGradientStops.set = function(t) {
        kt(this._fillGradientStops, t) || (this._fillGradientStops = t,
        this.styleID++)
    }
    ,
    es.fontFamily.get = function() {
        return this._fontFamily
    }
    ,
    es.fontFamily.set = function(t) {
        this.fontFamily !== t && (this._fontFamily = t,
        this.styleID++)
    }
    ,
    es.fontSize.get = function() {
        return this._fontSize
    }
    ,
    es.fontSize.set = function(t) {
        this._fontSize !== t && (this._fontSize = t,
        this.styleID++)
    }
    ,
    es.fontStyle.get = function() {
        return this._fontStyle
    }
    ,
    es.fontStyle.set = function(t) {
        this._fontStyle !== t && (this._fontStyle = t,
        this.styleID++)
    }
    ,
    es.fontVariant.get = function() {
        return this._fontVariant
    }
    ,
    es.fontVariant.set = function(t) {
        this._fontVariant !== t && (this._fontVariant = t,
        this.styleID++)
    }
    ,
    es.fontWeight.get = function() {
        return this._fontWeight
    }
    ,
    es.fontWeight.set = function(t) {
        this._fontWeight !== t && (this._fontWeight = t,
        this.styleID++)
    }
    ,
    es.letterSpacing.get = function() {
        return this._letterSpacing
    }
    ,
    es.letterSpacing.set = function(t) {
        this._letterSpacing !== t && (this._letterSpacing = t,
        this.styleID++)
    }
    ,
    es.lineHeight.get = function() {
        return this._lineHeight
    }
    ,
    es.lineHeight.set = function(t) {
        this._lineHeight !== t && (this._lineHeight = t,
        this.styleID++)
    }
    ,
    es.leading.get = function() {
        return this._leading
    }
    ,
    es.leading.set = function(t) {
        this._leading !== t && (this._leading = t,
        this.styleID++)
    }
    ,
    es.lineJoin.get = function() {
        return this._lineJoin
    }
    ,
    es.lineJoin.set = function(t) {
        this._lineJoin !== t && (this._lineJoin = t,
        this.styleID++)
    }
    ,
    es.miterLimit.get = function() {
        return this._miterLimit
    }
    ,
    es.miterLimit.set = function(t) {
        this._miterLimit !== t && (this._miterLimit = t,
        this.styleID++)
    }
    ,
    es.padding.get = function() {
        return this._padding
    }
    ,
    es.padding.set = function(t) {
        this._padding !== t && (this._padding = t,
        this.styleID++)
    }
    ,
    es.stroke.get = function() {
        return this._stroke
    }
    ,
    es.stroke.set = function(t) {
        var e = Ut(t);
        this._stroke !== e && (this._stroke = e,
        this.styleID++)
    }
    ,
    es.strokeThickness.get = function() {
        return this._strokeThickness
    }
    ,
    es.strokeThickness.set = function(t) {
        this._strokeThickness !== t && (this._strokeThickness = t,
        this.styleID++)
    }
    ,
    es.textBaseline.get = function() {
        return this._textBaseline
    }
    ,
    es.textBaseline.set = function(t) {
        this._textBaseline !== t && (this._textBaseline = t,
        this.styleID++)
    }
    ,
    es.trim.get = function() {
        return this._trim
    }
    ,
    es.trim.set = function(t) {
        this._trim !== t && (this._trim = t,
        this.styleID++)
    }
    ,
    es.whiteSpace.get = function() {
        return this._whiteSpace
    }
    ,
    es.whiteSpace.set = function(t) {
        this._whiteSpace !== t && (this._whiteSpace = t,
        this.styleID++)
    }
    ,
    es.wordWrap.get = function() {
        return this._wordWrap
    }
    ,
    es.wordWrap.set = function(t) {
        this._wordWrap !== t && (this._wordWrap = t,
        this.styleID++)
    }
    ,
    es.wordWrapWidth.get = function() {
        return this._wordWrapWidth
    }
    ,
    es.wordWrapWidth.set = function(t) {
        this._wordWrapWidth !== t && (this._wordWrapWidth = t,
        this.styleID++)
    }
    ,
    ts.prototype.toFontString = function() {
        var t = "number" == typeof this.fontSize ? this.fontSize + "px" : this.fontSize
          , e = this.fontFamily;
        Array.isArray(this.fontFamily) || (e = this.fontFamily.split(","));
        for (var i = e.length - 1; i >= 0; i--) {
            var r = e[i].trim();
            !/([\"\'])[^\'\"]+\1/.test(r) && $o.indexOf(r) < 0 && (r = '"' + r + '"'),
            e[i] = r
        }
        return this.fontStyle + " " + this.fontVariant + " " + this.fontWeight + " " + t + " " + e.join(",")
    }
    ,
    Object.defineProperties(ts.prototype, es);
    var is = function(t, e, i, r, n, o, s, a, h) {
        this.text = t,
        this.style = e,
        this.width = i,
        this.height = r,
        this.lines = n,
        this.lineWidths = o,
        this.lineHeight = s,
        this.maxLineWidth = a,
        this.fontProperties = h
    };
    is.measureText = function(t, e, i, r) {
        void 0 === r && (r = is._canvas),
        i = void 0 === i || null === i ? e.wordWrap : i;
        var n = e.toFontString()
          , o = is.measureFont(n);
        0 === o.fontSize && (o.fontSize = e.fontSize,
        o.ascent = e.fontSize);
        var s = r.getContext("2d");
        s.font = n;
        for (var a = i ? is.wordWrap(t, e, r) : t, h = a.split(/(?:\r\n|\r|\n)/), u = new Array(h.length), l = 0, c = 0; c < h.length; c++) {
            var d = s.measureText(h[c]).width + (h[c].length - 1) * e.letterSpacing;
            u[c] = d,
            l = Math.max(l, d)
        }
        var p = l + e.strokeThickness;
        e.dropShadow && (p += e.dropShadowDistance);
        var f = e.lineHeight || o.fontSize + e.strokeThickness
          , v = Math.max(f, o.fontSize + e.strokeThickness) + (h.length - 1) * (f + e.leading);
        return e.dropShadow && (v += e.dropShadowDistance),
        new is(t,e,p,v,h,u,f + e.leading,l,o)
    }
    ,
    is.wordWrap = function(t, e, i) {
        void 0 === i && (i = is._canvas);
        for (var r = i.getContext("2d"), n = 0, o = "", s = "", a = {}, h = e.letterSpacing, u = e.whiteSpace, l = is.collapseSpaces(u), c = is.collapseNewlines(u), d = !l, p = e.wordWrapWidth + h, f = is.tokenize(t), v = 0; v < f.length; v++) {
            var g = f[v];
            if (is.isNewline(g)) {
                if (!c) {
                    s += is.addLine(o),
                    d = !l,
                    o = "",
                    n = 0;
                    continue
                }
                g = " "
            }
            if (l) {
                var m = is.isBreakingSpace(g)
                  , y = is.isBreakingSpace(o[o.length - 1]);
                if (m && y)
                    continue
            }
            var _ = is.getFromCache(g, h, a, r);
            if (_ > p)
                if ("" !== o && (s += is.addLine(o),
                o = "",
                n = 0),
                is.canBreakWords(g, e.breakWords))
                    for (var x = g.split(""), b = 0; b < x.length; b++) {
                        for (var T = x[b], w = 1; x[b + w]; ) {
                            var E = x[b + w]
                              , S = T[T.length - 1];
                            if (is.canBreakChars(S, E, g, b, e.breakWords))
                                break;
                            T += E,
                            w++
                        }
                        b += T.length - 1;
                        var I = is.getFromCache(T, h, a, r);
                        I + n > p && (s += is.addLine(o),
                        d = !1,
                        o = "",
                        n = 0),
                        o += T,
                        n += I
                    }
                else {
                    o.length > 0 && (s += is.addLine(o),
                    o = "",
                    n = 0);
                    var P = v === f.length - 1;
                    s += is.addLine(g, !P),
                    d = !1,
                    o = "",
                    n = 0
                }
            else
                _ + n > p && (d = !1,
                s += is.addLine(o),
                o = "",
                n = 0),
                (o.length > 0 || !is.isBreakingSpace(g) || d) && (o += g,
                n += _)
        }
        return s += is.addLine(o, !1)
    }
    ,
    is.addLine = function(t, e) {
        return void 0 === e && (e = !0),
        t = is.trimRight(t),
        t = e ? t + "\n" : t
    }
    ,
    is.getFromCache = function(t, e, i, r) {
        var n = i[t];
        if (void 0 === n) {
            var o = t.length * e;
            n = r.measureText(t).width + o,
            i[t] = n
        }
        return n
    }
    ,
    is.collapseSpaces = function(t) {
        return "normal" === t || "pre-line" === t
    }
    ,
    is.collapseNewlines = function(t) {
        return "normal" === t
    }
    ,
    is.trimRight = function(t) {
        if ("string" != typeof t)
            return "";
        for (var e = t.length - 1; e >= 0; e--) {
            var i = t[e];
            if (!is.isBreakingSpace(i))
                break;
            t = t.slice(0, -1)
        }
        return t
    }
    ,
    is.isNewline = function(t) {
        return "string" == typeof t && is._newlines.indexOf(t.charCodeAt(0)) >= 0
    }
    ,
    is.isBreakingSpace = function(t) {
        return "string" == typeof t && is._breakingSpaces.indexOf(t.charCodeAt(0)) >= 0
    }
    ,
    is.tokenize = function(t) {
        var e = []
          , i = "";
        if ("string" != typeof t)
            return e;
        for (var r = 0; r < t.length; r++) {
            var n = t[r];
            is.isBreakingSpace(n) || is.isNewline(n) ? ("" !== i && (e.push(i),
            i = ""),
            e.push(n)) : i += n
        }
        return "" !== i && e.push(i),
        e
    }
    ,
    is.canBreakWords = function(t, e) {
        return e
    }
    ,
    is.canBreakChars = function(t, e, i, r, n) {
        return !0
    }
    ,
    is.measureFont = function(t) {
        if (is._fonts[t])
            return is._fonts[t];
        var e = {}
          , i = is._canvas
          , r = is._context;
        r.font = t;
        var n = is.METRICS_STRING + is.BASELINE_SYMBOL
          , o = Math.ceil(r.measureText(n).width)
          , s = Math.ceil(r.measureText(is.BASELINE_SYMBOL).width)
          , a = 2 * s;
        s = s * is.BASELINE_MULTIPLIER | 0,
        i.width = o,
        i.height = a,
        r.fillStyle = "#f00",
        r.fillRect(0, 0, o, a),
        r.font = t,
        r.textBaseline = "alphabetic",
        r.fillStyle = "#000",
        r.fillText(n, 0, s);
        var h = r.getImageData(0, 0, o, a).data
          , u = h.length
          , l = 4 * o
          , c = 0
          , d = 0
          , p = !1;
        for (c = 0; c < s; ++c) {
            for (var f = 0; f < l; f += 4)
                if (255 !== h[d + f]) {
                    p = !0;
                    break
                }
            if (p)
                break;
            d += l
        }
        for (e.ascent = s - c,
        d = u - l,
        p = !1,
        c = a; c > s; --c) {
            for (var v = 0; v < l; v += 4)
                if (255 !== h[d + v]) {
                    p = !0;
                    break
                }
            if (p)
                break;
            d -= l
        }
        return e.descent = c - s,
        e.fontSize = e.ascent + e.descent,
        is._fonts[t] = e,
        e
    }
    ,
    is.clearMetrics = function(t) {
        void 0 === t && (t = ""),
        t ? delete is._fonts[t] : is._fonts = {}
    }
    ;
    var rs = function() {
        try {
            var t = new OffscreenCanvas(0,0);
            return t.getContext("2d") ? t : document.createElement("canvas")
        } catch (t) {
            return document.createElement("canvas")
        }
    }();
    rs.width = rs.height = 10,
    is._canvas = rs,
    is._context = rs.getContext("2d"),
    is._fonts = {},
    is.METRICS_STRING = "|ÉqÅ",
    is.BASELINE_SYMBOL = "M",
    is.BASELINE_MULTIPLIER = 1.4,
    is._newlines = [10, 13],
    is._breakingSpaces = [9, 32, 8192, 8193, 8194, 8195, 8196, 8197, 8198, 8200, 8201, 8202, 8287, 12288];
    var ns = {
        texture: !0,
        children: !1,
        baseTexture: !0
    }
      , os = function(t) {
        function e(e, i, r) {
            r = r || document.createElement("canvas"),
            r.width = 3,
            r.height = 3;
            var n = Lr.from(r);
            n.orig = new Yi,
            n.trim = new Yi,
            t.call(this, n),
            this.canvas = r,
            this.context = this.canvas.getContext("2d"),
            this._resolution = Ie.RESOLUTION,
            this._autoResolution = !0,
            this._text = null,
            this._style = null,
            this._styleListener = null,
            this._font = "",
            this.text = e,
            this.style = i,
            this.localStyleID = -1
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            width: {
                configurable: !0
            },
            height: {
                configurable: !0
            },
            style: {
                configurable: !0
            },
            text: {
                configurable: !0
            },
            resolution: {
                configurable: !0
            }
        };
        return e.prototype.updateText = function(t) {
            var e = this._style;
            if (this.localStyleID !== e.styleID && (this.dirty = !0,
            this.localStyleID = e.styleID),
            this.dirty || !t) {
                this._font = this._style.toFontString();
                var i = this.context
                  , r = is.measureText(this._text || " ", this._style, this._style.wordWrap, this.canvas)
                  , n = r.width
                  , o = r.height
                  , s = r.lines
                  , a = r.lineHeight
                  , h = r.lineWidths
                  , u = r.maxLineWidth
                  , l = r.fontProperties;
                this.canvas.width = Math.ceil((Math.max(1, n) + 2 * e.padding) * this._resolution),
                this.canvas.height = Math.ceil((Math.max(1, o) + 2 * e.padding) * this._resolution),
                i.scale(this._resolution, this._resolution),
                i.clearRect(0, 0, this.canvas.width, this.canvas.height),
                i.font = this._font,
                i.lineWidth = e.strokeThickness,
                i.textBaseline = e.textBaseline,
                i.lineJoin = e.lineJoin,
                i.miterLimit = e.miterLimit;
                for (var c, d, p = e.dropShadow ? 2 : 1, f = 0; f < p; ++f) {
                    var v = e.dropShadow && 0 === f
                      , g = v ? 2 * o : 0
                      , m = g * this.resolution;
                    if (v) {
                        i.fillStyle = "black",
                        i.strokeStyle = "black";
                        var y = e.dropShadowColor
                          , _ = z("number" == typeof y ? y : Y(y));
                        i.shadowColor = "rgba(" + 255 * _[0] + "," + 255 * _[1] + "," + 255 * _[2] + "," + e.dropShadowAlpha + ")",
                        i.shadowBlur = e.dropShadowBlur,
                        i.shadowOffsetX = Math.cos(e.dropShadowAngle) * e.dropShadowDistance,
                        i.shadowOffsetY = Math.sin(e.dropShadowAngle) * e.dropShadowDistance + m
                    } else
                        i.fillStyle = this._generateFillStyle(e, s),
                        i.strokeStyle = e.stroke,
                        i.shadowColor = 0,
                        i.shadowBlur = 0,
                        i.shadowOffsetX = 0,
                        i.shadowOffsetY = 0;
                    for (var x = 0; x < s.length; x++)
                        c = e.strokeThickness / 2,
                        d = e.strokeThickness / 2 + x * a + l.ascent,
                        "right" === e.align ? c += u - h[x] : "center" === e.align && (c += (u - h[x]) / 2),
                        e.stroke && e.strokeThickness && this.drawLetterSpacing(s[x], c + e.padding, d + e.padding - g, !0),
                        e.fill && this.drawLetterSpacing(s[x], c + e.padding, d + e.padding - g)
                }
                this.updateTexture()
            }
        }
        ,
        e.prototype.drawLetterSpacing = function(t, e, i, r) {
            void 0 === r && (r = !1);
            var n = this._style
              , o = n.letterSpacing;
            if (0 === o)
                return void (r ? this.context.strokeText(t, e, i) : this.context.fillText(t, e, i));
            for (var s = e, a = Array.from ? Array.from(t) : t.split(""), h = this.context.measureText(t).width, u = 0, l = 0; l < a.length; ++l) {
                var c = a[l];
                r ? this.context.strokeText(c, s, i) : this.context.fillText(c, s, i),
                u = this.context.measureText(t.substring(l + 1)).width,
                s += h - u + o,
                h = u
            }
        }
        ,
        e.prototype.updateTexture = function() {
            var t = this.canvas;
            if (this._style.trim) {
                var e = at(t);
                e.data && (t.width = e.width,
                t.height = e.height,
                this.context.putImageData(e.data, 0, 0))
            }
            var i = this._texture
              , r = this._style
              , n = r.trim ? 0 : r.padding
              , o = i.baseTexture;
            i.trim.width = i._frame.width = Math.ceil(t.width / this._resolution),
            i.trim.height = i._frame.height = Math.ceil(t.height / this._resolution),
            i.trim.x = -n,
            i.trim.y = -n,
            i.orig.width = i._frame.width - 2 * n,
            i.orig.height = i._frame.height - 2 * n,
            this._onTextureUpdate(),
            o.setRealSize(t.width, t.height, this._resolution),
            this.dirty = !1
        }
        ,
        e.prototype._render = function(e) {
            this._autoResolution && this._resolution !== e.resolution && (this._resolution = e.resolution,
            this.dirty = !0),
            this.updateText(!0),
            t.prototype._render.call(this, e)
        }
        ,
        e.prototype.getLocalBounds = function(e) {
            return this.updateText(!0),
            t.prototype.getLocalBounds.call(this, e)
        }
        ,
        e.prototype._calculateBounds = function() {
            this.updateText(!0),
            this.calculateVertices(),
            this._bounds.addQuad(this.vertexData)
        }
        ,
        e.prototype._onStyleChange = function() {
            this.dirty = !0
        }
        ,
        e.prototype._generateFillStyle = function(t, e) {
            if (!Array.isArray(t.fill))
                return t.fill;
            if (1 === t.fill.length)
                return t.fill[0];
            var i, r, n, o, s = Math.ceil(this.canvas.width / this._resolution), a = Math.ceil(this.canvas.height / this._resolution), h = t.fill.slice(), u = t.fillGradientStops.slice();
            if (!u.length)
                for (var l = h.length + 1, c = 1; c < l; ++c)
                    u.push(c / l);
            if (h.unshift(t.fill[0]),
            u.unshift(0),
            h.push(t.fill[t.fill.length - 1]),
            u.push(1),
            t.fillGradientType === Jo.LINEAR_VERTICAL) {
                i = this.context.createLinearGradient(s / 2, 0, s / 2, a),
                r = (h.length + 1) * e.length,
                n = 0;
                for (var d = 0; d < e.length; d++) {
                    n += 1;
                    for (var p = 0; p < h.length; p++)
                        o = "number" == typeof u[p] ? u[p] / e.length + d / e.length : n / r,
                        i.addColorStop(o, h[p]),
                        n++
                }
            } else {
                i = this.context.createLinearGradient(0, a / 2, s, a / 2),
                r = h.length + 1,
                n = 1;
                for (var f = 0; f < h.length; f++)
                    o = "number" == typeof u[f] ? u[f] : n / r,
                    i.addColorStop(o, h[f]),
                    n++
            }
            return i
        }
        ,
        e.prototype.destroy = function(e) {
            "boolean" == typeof e && (e = {
                children: e
            }),
            e = Object.assign({}, ns, e),
            t.prototype.destroy.call(this, e),
            this.context = null,
            this.canvas = null,
            this._style = null
        }
        ,
        i.width.get = function() {
            return this.updateText(!0),
            Math.abs(this.scale.x) * this._texture.orig.width
        }
        ,
        i.width.set = function(t) {
            this.updateText(!0);
            var e = et(this.scale.x) || 1;
            this.scale.x = e * t / this._texture.orig.width,
            this._width = t
        }
        ,
        i.height.get = function() {
            return this.updateText(!0),
            Math.abs(this.scale.y) * this._texture.orig.height
        }
        ,
        i.height.set = function(t) {
            this.updateText(!0);
            var e = et(this.scale.y) || 1;
            this.scale.y = e * t / this._texture.orig.height,
            this._height = t
        }
        ,
        i.style.get = function() {
            return this._style
        }
        ,
        i.style.set = function(t) {
            t = t || {},
            this._style = t instanceof ts ? t : new ts(t),
            this.localStyleID = -1,
            this.dirty = !0
        }
        ,
        i.text.get = function() {
            return this._text
        }
        ,
        i.text.set = function(t) {
            t = String(null === t || void 0 === t ? "" : t),
            this._text !== t && (this._text = t,
            this.dirty = !0)
        }
        ,
        i.resolution.get = function() {
            return this._resolution
        }
        ,
        i.resolution.set = function(t) {
            this._autoResolution = !1,
            this._resolution !== t && (this._resolution = t,
            this.dirty = !0)
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Ko);
    Ie.UPLOADS_PER_FRAME = 4;
    var ss = function(t) {
        this.maxItemsPerFrame = t,
        this.itemsLeft = 0
    };
    ss.prototype.beginFrame = function() {
        this.itemsLeft = this.maxItemsPerFrame
    }
    ,
    ss.prototype.allowedToUpload = function() {
        return this.itemsLeft-- > 0
    }
    ;
    var as = function(t) {
        var e = this;
        this.limiter = new ss(Ie.UPLOADS_PER_FRAME),
        this.renderer = t,
        this.uploadHookHelper = null,
        this.queue = [],
        this.addHooks = [],
        this.uploadHooks = [],
        this.completes = [],
        this.ticking = !1,
        this.delayedTick = function() {
            e.queue && e.prepareItems()
        }
        ,
        this.registerFindHook(Yt),
        this.registerFindHook(Wt),
        this.registerFindHook(jt),
        this.registerFindHook(Gt),
        this.registerFindHook(Ht),
        this.registerUploadHook(zt),
        this.registerUploadHook(Vt)
    };
    as.prototype.upload = function(t, e) {
        "function" == typeof t && (e = t,
        t = null),
        t && this.add(t),
        this.queue.length ? (e && this.completes.push(e),
        this.ticking || (this.ticking = !0,
        ur.system.addOnce(this.tick, this, ar.UTILITY))) : e && e()
    }
    ,
    as.prototype.tick = function() {
        setTimeout(this.delayedTick, 0)
    }
    ,
    as.prototype.prepareItems = function() {
        for (this.limiter.beginFrame(); this.queue.length && this.limiter.allowedToUpload(); ) {
            var t = this.queue[0]
              , e = !1;
            if (t && !t._destroyed)
                for (var i = 0, r = this.uploadHooks.length; i < r; i++)
                    if (this.uploadHooks[i](this.uploadHookHelper, t)) {
                        this.queue.shift(),
                        e = !0;
                        break
                    }
            e || this.queue.shift()
        }
        if (this.queue.length)
            ur.system.addOnce(this.tick, this, ar.UTILITY);
        else {
            this.ticking = !1;
            var n = this.completes.slice(0);
            this.completes.length = 0;
            for (var o = 0, s = n.length; o < s; o++)
                n[o]()
        }
    }
    ,
    as.prototype.registerFindHook = function(t) {
        return t && this.addHooks.push(t),
        this
    }
    ,
    as.prototype.registerUploadHook = function(t) {
        return t && this.uploadHooks.push(t),
        this
    }
    ,
    as.prototype.add = function(t) {
        for (var e = 0, i = this.addHooks.length; e < i && !this.addHooks[e](t, this.queue); e++)
            ;
        if (t instanceof er)
            for (var r = t.children.length - 1; r >= 0; r--)
                this.add(t.children[r]);
        return this
    }
    ,
    as.prototype.destroy = function() {
        this.ticking && ur.system.remove(this.tick, this),
        this.ticking = !1,
        this.addHooks = null,
        this.uploadHooks = null,
        this.renderer = null,
        this.completes = null,
        this.queue = null,
        this.limiter = null,
        this.uploadHookHelper = null
    }
    ;
    var hs = function(t) {
        function e(e) {
            t.call(this, e),
            this.uploadHookHelper = this.renderer,
            this.registerFindHook(Kt),
            this.registerUploadHook(qt),
            this.registerUploadHook(Zt)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e
    }(as)
      , us = function(t) {
        this.maxMilliseconds = t,
        this.frameStart = 0
    };
    us.prototype.beginFrame = function() {
        this.frameStart = Date.now()
    }
    ,
    us.prototype.allowedToUpload = function() {
        return Date.now() - this.frameStart < this.maxMilliseconds
    }
    ;
    var ls = {
        BasePrepare: as,
        CountLimiter: ss,
        Prepare: hs,
        TimeLimiter: us
    }
      , cs = function t(e) {
        var i = this;
        e = Object.assign({
            forceCanvas: !1
        }, e),
        this.renderer = Mt(e),
        this.stage = new er,
        t._plugins.forEach(function(t) {
            t.init.call(i, e)
        })
    }
      , ds = {
        view: {
            configurable: !0
        },
        screen: {
            configurable: !0
        }
    };
    cs.registerPlugin = function(t) {
        cs._plugins.push(t)
    }
    ,
    cs.prototype.render = function() {
        this.renderer.render(this.stage)
    }
    ,
    ds.view.get = function() {
        return this.renderer.view
    }
    ,
    ds.screen.get = function() {
        return this.renderer.screen
    }
    ,
    cs.prototype.destroy = function(t, e) {
        var i = this
          , r = cs._plugins.slice(0);
        r.reverse(),
        r.forEach(function(t) {
            t.destroy.call(i)
        }),
        this.stage.destroy(e),
        this.stage = null,
        this.renderer.destroy(t),
        this.renderer = null,
        this._options = null
    }
    ,
    Object.defineProperties(cs.prototype, ds),
    cs._plugins = [];
    var ps = function() {};
    ps.init = function(t) {
        var e = this;
        Object.defineProperty(this, "resizeTo", {
            set: function(t) {
                window.removeEventListener("resize", this.resize),
                this._resizeTo = t,
                t && (window.addEventListener("resize", this.resize),
                this.resize())
            },
            get: function() {
                return this._resizeTo
            }
        }),
        this.resize = function() {
            e._resizeTo && (e._resizeTo === window ? e.renderer.resize(window.innerWidth, window.innerHeight) : e.renderer.resize(e._resizeTo.clientWidth, e._resizeTo.clientHeight))
        }
        ,
        this._resizeTo = null,
        this.resizeTo = t.resizeTo || null
    }
    ,
    ps.destroy = function() {
        this.resizeTo = null,
        this.resize = null
    }
    ,
    cs.registerPlugin(ps);
    var fs = function(t, e) {
        e = e || {};
        for (var i = {
            key: ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"],
            q: {
                name: "queryKey",
                parser: /(?:^|&)([^&=]*)=?([^&]*)/g
            },
            parser: {
                strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
                loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/
            }
        }, r = i.parser[e.strictMode ? "strict" : "loose"].exec(t), n = {}, o = 14; o--; )
            n[i.key[o]] = r[o] || "";
        return n[i.q.name] = {},
        n[i.key[12]].replace(i.q.parser, function(t, e, r) {
            e && (n[i.q.name][e] = r)
        }),
        n
    }
      , vs = e(function(t, e) {
        function i(t, e) {
            if (!(t instanceof e))
                throw new TypeError("Cannot call a class as a function")
        }
        function r(t, e) {
            return t._head ? (t._tail._next = e,
            e._prev = t._tail,
            t._tail = e) : (t._head = e,
            t._tail = e),
            e._owner = t,
            e
        }
        Object.defineProperty(e, "__esModule", {
            value: !0
        });
        var n = function() {
            function t(t, e) {
                for (var i = 0; i < e.length; i++) {
                    var r = e[i];
                    r.enumerable = r.enumerable || !1,
                    r.configurable = !0,
                    "value"in r && (r.writable = !0),
                    Object.defineProperty(t, r.key, r)
                }
            }
            return function(e, i, r) {
                return i && t(e.prototype, i),
                r && t(e, r),
                e
            }
        }()
          , o = function() {
            function t(e, r, n) {
                void 0 === r && (r = !1),
                i(this, t),
                this._fn = e,
                this._once = r,
                this._thisArg = n,
                this._next = this._prev = this._owner = null
            }
            return n(t, [{
                key: "detach",
                value: function() {
                    return null !== this._owner && (this._owner.detach(this),
                    !0)
                }
            }]),
            t
        }()
          , s = function() {
            function t() {
                i(this, t),
                this._head = this._tail = void 0
            }
            return n(t, [{
                key: "handlers",
                value: function() {
                    var t = !(arguments.length <= 0 || void 0 === arguments[0]) && arguments[0]
                      , e = this._head;
                    if (t)
                        return !!e;
                    for (var i = []; e; )
                        i.push(e),
                        e = e._next;
                    return i
                }
            }, {
                key: "has",
                value: function(t) {
                    if (!(t instanceof o))
                        throw new Error("MiniSignal#has(): First arg must be a MiniSignalBinding object.");
                    return t._owner === this
                }
            }, {
                key: "dispatch",
                value: function() {
                    var t = arguments
                      , e = this._head;
                    if (!e)
                        return !1;
                    for (; e; )
                        e._once && this.detach(e),
                        e._fn.apply(e._thisArg, t),
                        e = e._next;
                    return !0
                }
            }, {
                key: "add",
                value: function(t) {
                    var e = arguments.length <= 1 || void 0 === arguments[1] ? null : arguments[1];
                    if ("function" != typeof t)
                        throw new Error("MiniSignal#add(): First arg must be a Function.");
                    return r(this, new o(t,!1,e))
                }
            }, {
                key: "once",
                value: function(t) {
                    var e = arguments.length <= 1 || void 0 === arguments[1] ? null : arguments[1];
                    if ("function" != typeof t)
                        throw new Error("MiniSignal#once(): First arg must be a Function.");
                    return r(this, new o(t,!0,e))
                }
            }, {
                key: "detach",
                value: function(t) {
                    if (!(t instanceof o))
                        throw new Error("MiniSignal#detach(): First arg must be a MiniSignalBinding object.");
                    return t._owner !== this ? this : (t._prev && (t._prev._next = t._next),
                    t._next && (t._next._prev = t._prev),
                    t === this._head ? (this._head = t._next,
                    null === t._next && (this._tail = null)) : t === this._tail && (this._tail = t._prev,
                    this._tail._next = null),
                    t._owner = null,
                    this)
                }
            }, {
                key: "detachAll",
                value: function() {
                    var t = this._head;
                    if (!t)
                        return this;
                    for (this._head = this._tail = null; t; )
                        t._owner = null,
                        t = t._next;
                    return this
                }
            }]),
            t
        }();
        s.MiniSignalBinding = o,
        e.default = s,
        t.exports = e.default
    })
      , gs = function(t) {
        return t && t.__esModule && Object.prototype.hasOwnProperty.call(t, "default") ? t.default : t
    }(vs)
      , ms = {}
      , ys = !(!window.XDomainRequest || "withCredentials"in new XMLHttpRequest)
      , _s = null
      , xs = function() {
        function t(e, i, r) {
            if ("string" != typeof e || "string" != typeof i)
                throw new Error("Both name and url are required for constructing a resource.");
            r = r || {},
            this._flags = 0,
            this._setFlag(t.STATUS_FLAGS.DATA_URL, 0 === i.indexOf("data:")),
            this.name = e,
            this.url = i,
            this.extension = this._getExtension(),
            this.data = null,
            this.crossOrigin = !0 === r.crossOrigin ? "anonymous" : r.crossOrigin,
            this.timeout = r.timeout || 0,
            this.loadType = r.loadType || this._determineLoadType(),
            this.xhrType = r.xhrType,
            this.metadata = r.metadata || {},
            this.error = null,
            this.xhr = null,
            this.children = [],
            this.type = t.TYPE.UNKNOWN,
            this.progressChunk = 0,
            this._dequeue = ne,
            this._onLoadBinding = null,
            this._elementTimer = 0,
            this._boundComplete = this.complete.bind(this),
            this._boundOnError = this._onError.bind(this),
            this._boundOnProgress = this._onProgress.bind(this),
            this._boundOnTimeout = this._onTimeout.bind(this),
            this._boundXhrOnError = this._xhrOnError.bind(this),
            this._boundXhrOnTimeout = this._xhrOnTimeout.bind(this),
            this._boundXhrOnAbort = this._xhrOnAbort.bind(this),
            this._boundXhrOnLoad = this._xhrOnLoad.bind(this),
            this.onStart = new gs,
            this.onProgress = new gs,
            this.onComplete = new gs,
            this.onAfterMiddleware = new gs
        }
        t.setExtensionLoadType = function(e, i) {
            oe(t._loadTypeMap, e, i)
        }
        ,
        t.setExtensionXhrType = function(e, i) {
            oe(t._xhrTypeMap, e, i)
        }
        ;
        var e = t.prototype;
        return e.complete = function() {
            this._clearEvents(),
            this._finish()
        }
        ,
        e.abort = function(e) {
            if (!this.error) {
                if (this.error = new Error(e),
                this._clearEvents(),
                this.xhr)
                    this.xhr.abort();
                else if (this.xdr)
                    this.xdr.abort();
                else if (this.data)
                    if (this.data.src)
                        this.data.src = t.EMPTY_GIF;
                    else
                        for (; this.data.firstChild; )
                            this.data.removeChild(this.data.firstChild);
                this._finish()
            }
        }
        ,
        e.load = function(e) {
            var i = this;
            if (!this.isLoading) {
                if (this.isComplete)
                    return void (e && setTimeout(function() {
                        return e(i)
                    }, 1));
                switch (e && this.onComplete.once(e),
                this._setFlag(t.STATUS_FLAGS.LOADING, !0),
                this.onStart.dispatch(this),
                !1 !== this.crossOrigin && "string" == typeof this.crossOrigin || (this.crossOrigin = this._determineCrossOrigin(this.url)),
                this.loadType) {
                case t.LOAD_TYPE.IMAGE:
                    this.type = t.TYPE.IMAGE,
                    this._loadElement("image");
                    break;
                case t.LOAD_TYPE.AUDIO:
                    this.type = t.TYPE.AUDIO,
                    this._loadSourceElement("audio");
                    break;
                case t.LOAD_TYPE.VIDEO:
                    this.type = t.TYPE.VIDEO,
                    this._loadSourceElement("video");
                    break;
                case t.LOAD_TYPE.XHR:
                default:
                    ys && this.crossOrigin ? this._loadXdr() : this._loadXhr()
                }
            }
        }
        ,
        e._hasFlag = function(t) {
            return 0 != (this._flags & t)
        }
        ,
        e._setFlag = function(t, e) {
            this._flags = e ? this._flags | t : this._flags & ~t
        }
        ,
        e._clearEvents = function() {
            clearTimeout(this._elementTimer),
            this.data && this.data.removeEventListener && (this.data.removeEventListener("error", this._boundOnError, !1),
            this.data.removeEventListener("load", this._boundComplete, !1),
            this.data.removeEventListener("progress", this._boundOnProgress, !1),
            this.data.removeEventListener("canplaythrough", this._boundComplete, !1)),
            this.xhr && (this.xhr.removeEventListener ? (this.xhr.removeEventListener("error", this._boundXhrOnError, !1),
            this.xhr.removeEventListener("timeout", this._boundXhrOnTimeout, !1),
            this.xhr.removeEventListener("abort", this._boundXhrOnAbort, !1),
            this.xhr.removeEventListener("progress", this._boundOnProgress, !1),
            this.xhr.removeEventListener("load", this._boundXhrOnLoad, !1)) : (this.xhr.onerror = null,
            this.xhr.ontimeout = null,
            this.xhr.onprogress = null,
            this.xhr.onload = null))
        }
        ,
        e._finish = function() {
            if (this.isComplete)
                throw new Error("Complete called again for an already completed resource.");
            this._setFlag(t.STATUS_FLAGS.COMPLETE, !0),
            this._setFlag(t.STATUS_FLAGS.LOADING, !1),
            this.onComplete.dispatch(this)
        }
        ,
        e._loadElement = function(t) {
            this.metadata.loadElement ? this.data = this.metadata.loadElement : "image" === t && void 0 !== window.Image ? this.data = new Image : this.data = document.createElement(t),
            this.crossOrigin && (this.data.crossOrigin = this.crossOrigin),
            this.metadata.skipSource || (this.data.src = this.url),
            this.data.addEventListener("error", this._boundOnError, !1),
            this.data.addEventListener("load", this._boundComplete, !1),
            this.data.addEventListener("progress", this._boundOnProgress, !1),
            this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout))
        }
        ,
        e._loadSourceElement = function(t) {
            if (this.metadata.loadElement ? this.data = this.metadata.loadElement : "audio" === t && void 0 !== window.Audio ? this.data = new Audio : this.data = document.createElement(t),
            null === this.data)
                return void this.abort("Unsupported element: " + t);
            if (this.crossOrigin && (this.data.crossOrigin = this.crossOrigin),
            !this.metadata.skipSource)
                if (navigator.isCocoonJS)
                    this.data.src = Array.isArray(this.url) ? this.url[0] : this.url;
                else if (Array.isArray(this.url))
                    for (var e = this.metadata.mimeType, i = 0; i < this.url.length; ++i)
                        this.data.appendChild(this._createSource(t, this.url[i], Array.isArray(e) ? e[i] : e));
                else {
                    var r = this.metadata.mimeType;
                    this.data.appendChild(this._createSource(t, this.url, Array.isArray(r) ? r[0] : r))
                }
            this.data.addEventListener("error", this._boundOnError, !1),
            this.data.addEventListener("load", this._boundComplete, !1),
            this.data.addEventListener("progress", this._boundOnProgress, !1),
            this.data.addEventListener("canplaythrough", this._boundComplete, !1),
            this.data.load(),
            this.timeout && (this._elementTimer = setTimeout(this._boundOnTimeout, this.timeout))
        }
        ,
        e._loadXhr = function() {
            "string" != typeof this.xhrType && (this.xhrType = this._determineXhrType());
            var e = this.xhr = new XMLHttpRequest;
            e.open("GET", this.url, !0),
            e.timeout = this.timeout,
            this.xhrType === t.XHR_RESPONSE_TYPE.JSON || this.xhrType === t.XHR_RESPONSE_TYPE.DOCUMENT ? e.responseType = t.XHR_RESPONSE_TYPE.TEXT : e.responseType = this.xhrType,
            e.addEventListener("error", this._boundXhrOnError, !1),
            e.addEventListener("timeout", this._boundXhrOnTimeout, !1),
            e.addEventListener("abort", this._boundXhrOnAbort, !1),
            e.addEventListener("progress", this._boundOnProgress, !1),
            e.addEventListener("load", this._boundXhrOnLoad, !1),
            e.send()
        }
        ,
        e._loadXdr = function() {
            "string" != typeof this.xhrType && (this.xhrType = this._determineXhrType());
            var t = this.xhr = new XDomainRequest;
            t.timeout = this.timeout || 5e3,
            t.onerror = this._boundXhrOnError,
            t.ontimeout = this._boundXhrOnTimeout,
            t.onprogress = this._boundOnProgress,
            t.onload = this._boundXhrOnLoad,
            t.open("GET", this.url, !0),
            setTimeout(function() {
                return t.send()
            }, 1)
        }
        ,
        e._createSource = function(t, e, i) {
            i || (i = t + "/" + this._getExtension(e));
            var r = document.createElement("source");
            return r.src = e,
            r.type = i,
            r
        }
        ,
        e._onError = function(t) {
            this.abort("Failed to load element using: " + t.target.nodeName)
        }
        ,
        e._onProgress = function(t) {
            t && t.lengthComputable && this.onProgress.dispatch(this, t.loaded / t.total)
        }
        ,
        e._onTimeout = function() {
            this.abort("Load timed out.")
        }
        ,
        e._xhrOnError = function() {
            var t = this.xhr;
            this.abort(se(t) + " Request failed. Status: " + t.status + ', text: "' + t.statusText + '"')
        }
        ,
        e._xhrOnTimeout = function() {
            var t = this.xhr;
            this.abort(se(t) + " Request timed out.")
        }
        ,
        e._xhrOnAbort = function() {
            var t = this.xhr;
            this.abort(se(t) + " Request was aborted by the user.")
        }
        ,
        e._xhrOnLoad = function() {
            var e = this.xhr
              , i = ""
              , r = void 0 === e.status ? 200 : e.status;
            if ("" !== e.responseType && "text" !== e.responseType && void 0 !== e.responseType || (i = e.responseText),
            0 === r && (i.length > 0 || e.responseType === t.XHR_RESPONSE_TYPE.BUFFER) ? r = 200 : 1223 === r && (r = 204),
            2 != (r / 100 | 0))
                return void this.abort("[" + e.status + "] " + e.statusText + ": " + e.responseURL);
            if (this.xhrType === t.XHR_RESPONSE_TYPE.TEXT)
                this.data = i,
                this.type = t.TYPE.TEXT;
            else if (this.xhrType === t.XHR_RESPONSE_TYPE.JSON)
                try {
                    this.data = JSON.parse(i),
                    this.type = t.TYPE.JSON
                } catch (t) {
                    return void this.abort("Error trying to parse loaded json: " + t)
                }
            else if (this.xhrType === t.XHR_RESPONSE_TYPE.DOCUMENT)
                try {
                    if (window.DOMParser) {
                        var n = new DOMParser;
                        this.data = n.parseFromString(i, "text/xml")
                    } else {
                        var o = document.createElement("div");
                        o.innerHTML = i,
                        this.data = o
                    }
                    this.type = t.TYPE.XML
                } catch (t) {
                    return void this.abort("Error trying to parse loaded xml: " + t)
                }
            else
                this.data = e.response || i;
            this.complete()
        }
        ,
        e._determineCrossOrigin = function(t, e) {
            if (0 === t.indexOf("data:"))
                return "";
            if (window.origin !== window.location.origin)
                return "anonymous";
            e = e || window.location,
            _s || (_s = document.createElement("a")),
            _s.href = t,
            t = fs(_s.href, {
                strictMode: !0
            });
            var i = !t.port && "" === e.port || t.port === e.port
              , r = t.protocol ? t.protocol + ":" : "";
            return t.host === e.hostname && i && r === e.protocol ? "" : "anonymous"
        }
        ,
        e._determineXhrType = function() {
            return t._xhrTypeMap[this.extension] || t.XHR_RESPONSE_TYPE.TEXT
        }
        ,
        e._determineLoadType = function() {
            return t._loadTypeMap[this.extension] || t.LOAD_TYPE.XHR
        }
        ,
        e._getExtension = function() {
            var t = this.url
              , e = "";
            if (this.isDataUrl) {
                var i = t.indexOf("/");
                e = t.substring(i + 1, t.indexOf(";", i))
            } else {
                var r = t.indexOf("?")
                  , n = t.indexOf("#")
                  , o = Math.min(r > -1 ? r : t.length, n > -1 ? n : t.length);
                t = t.substring(0, o),
                e = t.substring(t.lastIndexOf(".") + 1)
            }
            return e.toLowerCase()
        }
        ,
        e._getMimeFromXhrType = function(e) {
            switch (e) {
            case t.XHR_RESPONSE_TYPE.BUFFER:
                return "application/octet-binary";
            case t.XHR_RESPONSE_TYPE.BLOB:
                return "application/blob";
            case t.XHR_RESPONSE_TYPE.DOCUMENT:
                return "application/xml";
            case t.XHR_RESPONSE_TYPE.JSON:
                return "application/json";
            case t.XHR_RESPONSE_TYPE.DEFAULT:
            case t.XHR_RESPONSE_TYPE.TEXT:
            default:
                return "text/plain"
            }
        }
        ,
        re(t, [{
            key: "isDataUrl",
            get: function() {
                return this._hasFlag(t.STATUS_FLAGS.DATA_URL)
            }
        }, {
            key: "isComplete",
            get: function() {
                return this._hasFlag(t.STATUS_FLAGS.COMPLETE)
            }
        }, {
            key: "isLoading",
            get: function() {
                return this._hasFlag(t.STATUS_FLAGS.LOADING)
            }
        }]),
        t
    }();
    xs.STATUS_FLAGS = {
        NONE: 0,
        DATA_URL: 1,
        COMPLETE: 2,
        LOADING: 4
    },
    xs.TYPE = {
        UNKNOWN: 0,
        JSON: 1,
        XML: 2,
        IMAGE: 3,
        AUDIO: 4,
        VIDEO: 5,
        TEXT: 6
    },
    xs.LOAD_TYPE = {
        XHR: 1,
        IMAGE: 2,
        AUDIO: 3,
        VIDEO: 4
    },
    xs.XHR_RESPONSE_TYPE = {
        DEFAULT: "text",
        BUFFER: "arraybuffer",
        BLOB: "blob",
        DOCUMENT: "document",
        JSON: "json",
        TEXT: "text"
    },
    xs._loadTypeMap = {
        gif: xs.LOAD_TYPE.IMAGE,
        png: xs.LOAD_TYPE.IMAGE,
        bmp: xs.LOAD_TYPE.IMAGE,
        jpg: xs.LOAD_TYPE.IMAGE,
        jpeg: xs.LOAD_TYPE.IMAGE,
        tif: xs.LOAD_TYPE.IMAGE,
        tiff: xs.LOAD_TYPE.IMAGE,
        webp: xs.LOAD_TYPE.IMAGE,
        tga: xs.LOAD_TYPE.IMAGE,
        svg: xs.LOAD_TYPE.IMAGE,
        "svg+xml": xs.LOAD_TYPE.IMAGE,
        mp3: xs.LOAD_TYPE.AUDIO,
        ogg: xs.LOAD_TYPE.AUDIO,
        wav: xs.LOAD_TYPE.AUDIO,
        mp4: xs.LOAD_TYPE.VIDEO,
        webm: xs.LOAD_TYPE.VIDEO
    },
    xs._xhrTypeMap = {
        xhtml: xs.XHR_RESPONSE_TYPE.DOCUMENT,
        html: xs.XHR_RESPONSE_TYPE.DOCUMENT,
        htm: xs.XHR_RESPONSE_TYPE.DOCUMENT,
        xml: xs.XHR_RESPONSE_TYPE.DOCUMENT,
        tmx: xs.XHR_RESPONSE_TYPE.DOCUMENT,
        svg: xs.XHR_RESPONSE_TYPE.DOCUMENT,
        tsx: xs.XHR_RESPONSE_TYPE.DOCUMENT,
        gif: xs.XHR_RESPONSE_TYPE.BLOB,
        png: xs.XHR_RESPONSE_TYPE.BLOB,
        bmp: xs.XHR_RESPONSE_TYPE.BLOB,
        jpg: xs.XHR_RESPONSE_TYPE.BLOB,
        jpeg: xs.XHR_RESPONSE_TYPE.BLOB,
        tif: xs.XHR_RESPONSE_TYPE.BLOB,
        tiff: xs.XHR_RESPONSE_TYPE.BLOB,
        webp: xs.XHR_RESPONSE_TYPE.BLOB,
        tga: xs.XHR_RESPONSE_TYPE.BLOB,
        json: xs.XHR_RESPONSE_TYPE.JSON,
        text: xs.XHR_RESPONSE_TYPE.TEXT,
        txt: xs.XHR_RESPONSE_TYPE.TEXT,
        ttf: xs.XHR_RESPONSE_TYPE.BUFFER,
        otf: xs.XHR_RESPONSE_TYPE.BUFFER
    },
    xs.EMPTY_GIF = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
    var bs = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
      , Ts = window.URL || window.webkitURL
      , ws = {
        caching: ee,
        parsing: he
    }
      , Es = /(#[\w-]+)?$/
      , Ss = function() {
        function t(e, i) {
            var r = this;
            void 0 === e && (e = ""),
            void 0 === i && (i = 10),
            this.baseUrl = e,
            this.progress = 0,
            this.loading = !1,
            this.defaultQueryString = "",
            this._beforeMiddleware = [],
            this._afterMiddleware = [],
            this._resourcesParsing = [],
            this._boundLoadResource = function(t, e) {
                return r._loadResource(t, e)
            }
            ,
            this._queue = te(this._boundLoadResource, i),
            this._queue.pause(),
            this.resources = {},
            this.onProgress = new gs,
            this.onError = new gs,
            this.onLoad = new gs,
            this.onStart = new gs,
            this.onComplete = new gs;
            for (var n = 0; n < t._defaultBeforeMiddleware.length; ++n)
                this.pre(t._defaultBeforeMiddleware[n]);
            for (var o = 0; o < t._defaultAfterMiddleware.length; ++o)
                this.use(t._defaultAfterMiddleware[o])
        }
        var e = t.prototype;
        return e.add = function(t, e, i, r) {
            if (Array.isArray(t)) {
                for (var n = 0; n < t.length; ++n)
                    this.add(t[n]);
                return this
            }
            if ("object" == typeof t && (r = e || t.callback || t.onComplete,
            i = t,
            e = t.url,
            t = t.name || t.key || t.url),
            "string" != typeof e && (r = i,
            i = e,
            e = t),
            "string" != typeof e)
                throw new Error("No url passed to add resource to loader.");
            if ("function" == typeof i && (r = i,
            i = null),
            this.loading && (!i || !i.parentResource))
                throw new Error("Cannot add resources while the loader is running.");
            if (this.resources[t])
                throw new Error('Resource named "' + t + '" already exists.');
            if (e = this._prepareUrl(e),
            this.resources[t] = new xs(t,e,i),
            "function" == typeof r && this.resources[t].onAfterMiddleware.once(r),
            this.loading) {
                for (var o = i.parentResource, s = [], a = 0; a < o.children.length; ++a)
                    o.children[a].isComplete || s.push(o.children[a]);
                var h = o.progressChunk * (s.length + 1)
                  , u = h / (s.length + 2);
                o.children.push(this.resources[t]),
                o.progressChunk = u;
                for (var l = 0; l < s.length; ++l)
                    s[l].progressChunk = u;
                this.resources[t].progressChunk = u
            }
            return this._queue.push(this.resources[t]),
            this
        }
        ,
        e.pre = function(t) {
            return this._beforeMiddleware.push(t),
            this
        }
        ,
        e.use = function(t) {
            return this._afterMiddleware.push(t),
            this
        }
        ,
        e.reset = function() {
            this.progress = 0,
            this.loading = !1,
            this._queue.kill(),
            this._queue.pause();
            for (var t in this.resources) {
                var e = this.resources[t];
                e._onLoadBinding && e._onLoadBinding.detach(),
                e.isLoading && e.abort()
            }
            return this.resources = {},
            this
        }
        ,
        e.load = function(t) {
            if ("function" == typeof t && this.onComplete.once(t),
            this.loading)
                return this;
            if (this._queue.idle())
                this._onStart(),
                this._onComplete();
            else {
                for (var e = this._queue._tasks.length, i = 100 / e, r = 0; r < this._queue._tasks.length; ++r)
                    this._queue._tasks[r].data.progressChunk = i;
                this._onStart(),
                this._queue.resume()
            }
            return this
        }
        ,
        e._prepareUrl = function(t) {
            var e, i = fs(t, {
                strictMode: !0
            });
            if (e = i.protocol || !i.path || 0 === t.indexOf("//") ? t : this.baseUrl.length && this.baseUrl.lastIndexOf("/") !== this.baseUrl.length - 1 && "/" !== t.charAt(0) ? this.baseUrl + "/" + t : this.baseUrl + t,
            this.defaultQueryString) {
                var r = Es.exec(e)[0];
                e = e.substr(0, e.length - r.length),
                -1 !== e.indexOf("?") ? e += "&" + this.defaultQueryString : e += "?" + this.defaultQueryString,
                e += r
            }
            return e
        }
        ,
        e._loadResource = function(t, e) {
            var i = this;
            t._dequeue = e,
            Qt(this._beforeMiddleware, function(e, r) {
                e.call(i, t, function() {
                    r(t.isComplete ? {} : null)
                })
            }, function() {
                t.isComplete ? i._onLoad(t) : (t._onLoadBinding = t.onComplete.once(i._onLoad, i),
                t.load())
            }, !0)
        }
        ,
        e._onStart = function() {
            this.progress = 0,
            this.loading = !0,
            this.onStart.dispatch(this)
        }
        ,
        e._onComplete = function() {
            this.progress = 100,
            this.loading = !1,
            this.onComplete.dispatch(this, this.resources)
        }
        ,
        e._onLoad = function(t) {
            var e = this;
            t._onLoadBinding = null,
            this._resourcesParsing.push(t),
            t._dequeue(),
            Qt(this._afterMiddleware, function(i, r) {
                i.call(e, t, r)
            }, function() {
                t.onAfterMiddleware.dispatch(t),
                e.progress = Math.min(100, e.progress + t.progressChunk),
                e.onProgress.dispatch(e, t),
                t.error ? e.onError.dispatch(t.error, e, t) : e.onLoad.dispatch(e, t),
                e._resourcesParsing.splice(e._resourcesParsing.indexOf(t), 1),
                e._queue.idle() && 0 === e._resourcesParsing.length && e._onComplete()
            }, !0)
        }
        ,
        re(t, [{
            key: "concurrency",
            get: function() {
                return this._queue.concurrency
            },
            set: function(t) {
                this._queue.concurrency = t
            }
        }]),
        t
    }();
    Ss._defaultBeforeMiddleware = [],
    Ss._defaultAfterMiddleware = [],
    Ss.pre = function(t) {
        return Ss._defaultBeforeMiddleware.push(t),
        Ss
    }
    ,
    Ss.use = function(t) {
        return Ss._defaultAfterMiddleware.push(t),
        Ss
    }
    ;
    var Is = function() {};
    Is.use = function(t, e) {
        t.data && t.type === xs.TYPE.IMAGE && (t.texture = Lr.fromLoader(t.data, t.url, t.name)),
        e()
    }
    ;
    var Ps = function(t) {
        function e(i, r) {
            var n = this;
            t.call(this, i, r),
            Pe.call(this);
            for (var o = 0; o < e._plugins.length; ++o) {
                var s = e._plugins[o]
                  , a = s.pre
                  , h = s.use;
                a && this.pre(a),
                h && this.use(h)
            }
            this.onStart.add(function(t) {
                return n.emit("start", t)
            }),
            this.onProgress.add(function(t, e) {
                return n.emit("progress", t, e)
            }),
            this.onError.add(function(t, e, i) {
                return n.emit("error", t, e, i)
            }),
            this.onLoad.add(function(t, e) {
                return n.emit("load", t, e)
            }),
            this.onComplete.add(function(t, e) {
                return n.emit("complete", t, e)
            }),
            this._protected = !1
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            shared: {
                configurable: !0
            }
        };
        return e.prototype.destroy = function() {
            this._protected || (this.removeAllListeners(),
            this.reset())
        }
        ,
        i.shared.get = function() {
            var t = e._shared;
            return t || (t = new e,
            t._protected = !0,
            e._shared = t),
            t
        }
        ,
        Object.defineProperties(e, i),
        e
    }(Ss);
    Object.assign(Ps.prototype, Pe.prototype),
    Ps._plugins = [],
    Ps.registerPlugin = function(t) {
        return Ps._plugins.push(t),
        t.add && t.add(),
        Ps
    }
    ,
    Ps.registerPlugin({
        use: ws.parsing
    }),
    Ps.registerPlugin(Is);
    var As = function() {};
    As.init = function(t) {
        t = Object.assign({
            sharedLoader: !1
        }, t),
        this.loader = t.sharedLoader ? Ps.shared : new Ps
    }
    ,
    As.destroy = function() {
        this.loader && (this.loader.destroy(),
        this.loader = null)
    }
    ;
    var Os = xs
      , Cs = function(t) {
        function e(e, i, r, n) {
            void 0 === e && (e = 1500),
            void 0 === r && (r = 16384),
            void 0 === n && (n = !1),
            t.call(this);
            r > 16384 && (r = 16384),
            this._properties = [!1, !0, !1, !1, !1],
            this._maxSize = e,
            this._batchSize = r,
            this._buffers = null,
            this._bufferUpdateIDs = [],
            this._updateID = 0,
            this.interactiveChildren = !1,
            this.blendMode = ri.NORMAL,
            this.autoResize = n,
            this.roundPixels = !0,
            this.baseTexture = null,
            this.setProperties(i),
            this._tint = 0,
            this.tintRgb = new Float32Array(4),
            this.tint = 16777215
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            tint: {
                configurable: !0
            }
        };
        return e.prototype.setProperties = function(t) {
            t && (this._properties[0] = "vertices"in t || "scale"in t ? !!t.vertices || !!t.scale : this._properties[0],
            this._properties[1] = "position"in t ? !!t.position : this._properties[1],
            this._properties[2] = "rotation"in t ? !!t.rotation : this._properties[2],
            this._properties[3] = "uvs"in t ? !!t.uvs : this._properties[3],
            this._properties[4] = "tint"in t || "alpha"in t ? !!t.tint || !!t.alpha : this._properties[4])
        }
        ,
        e.prototype.updateTransform = function() {
            this.displayObjectUpdateTransform()
        }
        ,
        i.tint.get = function() {
            return this._tint
        }
        ,
        i.tint.set = function(t) {
            this._tint = t,
            z(t, this.tintRgb)
        }
        ,
        e.prototype.render = function(t) {
            var e = this;
            this.visible && !(this.worldAlpha <= 0) && this.children.length && this.renderable && (this.baseTexture || (this.baseTexture = this.children[0]._texture.baseTexture,
            this.baseTexture.valid || this.baseTexture.once("update", function() {
                return e.onChildrenChange(0)
            })),
            t.batch.setObjectRenderer(t.plugins.particle),
            t.plugins.particle.render(this))
        }
        ,
        e.prototype.onChildrenChange = function(t) {
            for (var e = Math.floor(t / this._batchSize); this._bufferUpdateIDs.length < e; )
                this._bufferUpdateIDs.push(0);
            this._bufferUpdateIDs[e] = ++this._updateID
        }
        ,
        e.prototype.dispose = function() {
            if (this._buffers) {
                for (var t = 0; t < this._buffers.length; ++t)
                    this._buffers[t].destroy();
                this._buffers = null
            }
        }
        ,
        e.prototype.destroy = function(e) {
            t.prototype.destroy.call(this, e),
            this.dispose(),
            this._properties = null,
            this._buffers = null,
            this._bufferUpdateIDs = null
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(er)
      , Ms = function(t, e, i) {
        this.geometry = new Vr,
        this.indexBuffer = null,
        this.size = i,
        this.dynamicProperties = [],
        this.staticProperties = [];
        for (var r = 0; r < t.length; ++r) {
            var n = t[r];
            n = {
                attributeName: n.attributeName,
                size: n.size,
                uploadFunction: n.uploadFunction,
                type: n.type || ai.FLOAT,
                offset: n.offset
            },
            e[r] ? this.dynamicProperties.push(n) : this.staticProperties.push(n)
        }
        this.staticStride = 0,
        this.staticBuffer = null,
        this.staticData = null,
        this.staticDataUint32 = null,
        this.dynamicStride = 0,
        this.dynamicBuffer = null,
        this.dynamicData = null,
        this.dynamicDataUint32 = null,
        this._updateID = 0,
        this.initBuffers()
    };
    Ms.prototype.initBuffers = function() {
        var t = this.geometry
          , e = 0;
        this.indexBuffer = new Xr(Q(this.size),!0,!0),
        t.addIndex(this.indexBuffer),
        this.dynamicStride = 0;
        for (var i = 0; i < this.dynamicProperties.length; ++i) {
            var r = this.dynamicProperties[i];
            r.offset = e,
            e += r.size,
            this.dynamicStride += r.size
        }
        var n = new ArrayBuffer(this.size * this.dynamicStride * 4 * 4);
        this.dynamicData = new Float32Array(n),
        this.dynamicDataUint32 = new Uint32Array(n),
        this.dynamicBuffer = new Xr(this.dynamicData,!1,!1);
        var o = 0;
        this.staticStride = 0;
        for (var s = 0; s < this.staticProperties.length; ++s) {
            var a = this.staticProperties[s];
            a.offset = o,
            o += a.size,
            this.staticStride += a.size
        }
        var h = new ArrayBuffer(this.size * this.staticStride * 4 * 4);
        this.staticData = new Float32Array(h),
        this.staticDataUint32 = new Uint32Array(h),
        this.staticBuffer = new Xr(this.staticData,!0,!1);
        for (var u = 0; u < this.dynamicProperties.length; ++u) {
            var l = this.dynamicProperties[u];
            t.addAttribute(l.attributeName, this.dynamicBuffer, 0, l.type === ai.UNSIGNED_BYTE, l.type, 4 * this.dynamicStride, 4 * l.offset)
        }
        for (var c = 0; c < this.staticProperties.length; ++c) {
            var d = this.staticProperties[c];
            t.addAttribute(d.attributeName, this.staticBuffer, 0, d.type === ai.UNSIGNED_BYTE, d.type, 4 * this.staticStride, 4 * d.offset)
        }
    }
    ,
    Ms.prototype.uploadDynamic = function(t, e, i) {
        for (var r = 0; r < this.dynamicProperties.length; r++) {
            var n = this.dynamicProperties[r];
            n.uploadFunction(t, e, i, n.type === ai.UNSIGNED_BYTE ? this.dynamicDataUint32 : this.dynamicData, this.dynamicStride, n.offset)
        }
        this.dynamicBuffer._updateID++
    }
    ,
    Ms.prototype.uploadStatic = function(t, e, i) {
        for (var r = 0; r < this.staticProperties.length; r++) {
            var n = this.staticProperties[r];
            n.uploadFunction(t, e, i, n.type === ai.UNSIGNED_BYTE ? this.staticDataUint32 : this.staticData, this.staticStride, n.offset)
        }
        this.staticBuffer._updateID++
    }
    ,
    Ms.prototype.destroy = function() {
        this.indexBuffer = null,
        this.dynamicProperties = null,
        this.dynamicBuffer = null,
        this.dynamicData = null,
        this.dynamicDataUint32 = null,
        this.staticProperties = null,
        this.staticBuffer = null,
        this.staticData = null,
        this.staticDataUint32 = null,
        this.geometry.destroy()
    }
    ;
    var Ds = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec4 aColor;\n\nattribute vec2 aPositionCoord;\nattribute float aRotation;\n\nuniform mat3 translationMatrix;\nuniform vec4 uColor;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nvoid main(void){\n    float x = (aVertexPosition.x) * cos(aRotation) - (aVertexPosition.y) * sin(aRotation);\n    float y = (aVertexPosition.x) * sin(aRotation) + (aVertexPosition.y) * cos(aRotation);\n\n    vec2 v = vec2(x, y);\n    v = v + aPositionCoord;\n\n    gl_Position = vec4((translationMatrix * vec3(v, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = aTextureCoord;\n    vColor = aColor * uColor;\n}\n"
      , Rs = "varying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void){\n    vec4 color = texture2D(uSampler, vTextureCoord) * vColor;\n    gl_FragColor = color;\n}"
      , Fs = function(t) {
        function e(e) {
            t.call(this, e),
            this.shader = null,
            this.properties = null,
            this.tempMatrix = new Fi,
            this.properties = [{
                attributeName: "aVertexPosition",
                size: 2,
                uploadFunction: this.uploadVertices,
                offset: 0
            }, {
                attributeName: "aPositionCoord",
                size: 2,
                uploadFunction: this.uploadPosition,
                offset: 0
            }, {
                attributeName: "aRotation",
                size: 1,
                uploadFunction: this.uploadRotation,
                offset: 0
            }, {
                attributeName: "aTextureCoord",
                size: 2,
                uploadFunction: this.uploadUvs,
                offset: 0
            }, {
                attributeName: "aColor",
                size: 1,
                type: ai.UNSIGNED_BYTE,
                uploadFunction: this.uploadTint,
                offset: 0
            }],
            this.shader = bn.from(Ds, Rs, {})
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.render = function(t) {
            var e = t.children
              , i = t._maxSize
              , r = t._batchSize
              , n = this.renderer
              , o = e.length;
            if (0 !== o) {
                o > i && !t.autoResize && (o = i);
                var s = t._buffers;
                s || (s = t._buffers = this.generateBuffers(t));
                var a = e[0]._texture.baseTexture;
                this.renderer.state.setBlendMode(q(t.blendMode, a.premultiplyAlpha));
                var h = n.gl
                  , u = t.worldTransform.copyTo(this.tempMatrix);
                u.prepend(n.globalUniforms.uniforms.projectionMatrix),
                this.shader.uniforms.translationMatrix = u.toArray(!0),
                this.shader.uniforms.uColor = Z(t.tintRgb, t.worldAlpha, this.shader.uniforms.uColor, a.premultiplyAlpha),
                this.shader.uniforms.uSampler = a,
                this.renderer.shader.bind(this.shader);
                for (var l = !1, c = 0, d = 0; c < o; c += r,
                d += 1) {
                    var p = o - c;
                    p > r && (p = r),
                    d >= s.length && s.push(this._generateOneMoreBuffer(t));
                    var f = s[d];
                    f.uploadDynamic(e, c, p);
                    var v = t._bufferUpdateIDs[d] || 0;
                    l = l || f._updateID < v,
                    l && (f._updateID = t._updateID,
                    f.uploadStatic(e, c, p)),
                    n.geometry.bind(f.geometry),
                    h.drawElements(h.TRIANGLES, 6 * p, h.UNSIGNED_SHORT, 0)
                }
            }
        }
        ,
        e.prototype.generateBuffers = function(t) {
            for (var e = [], i = t._maxSize, r = t._batchSize, n = t._properties, o = 0; o < i; o += r)
                e.push(new Ms(this.properties,n,r));
            return e
        }
        ,
        e.prototype._generateOneMoreBuffer = function(t) {
            var e = t._batchSize
              , i = t._properties;
            return new Ms(this.properties,i,e)
        }
        ,
        e.prototype.uploadVertices = function(t, e, i, r, n, o) {
            for (var s = 0, a = 0, h = 0, u = 0, l = 0; l < i; ++l) {
                var c = t[e + l]
                  , d = c._texture
                  , p = c.scale.x
                  , f = c.scale.y
                  , v = d.trim
                  , g = d.orig;
                v ? (a = v.x - c.anchor.x * g.width,
                s = a + v.width,
                u = v.y - c.anchor.y * g.height,
                h = u + v.height) : (s = g.width * (1 - c.anchor.x),
                a = g.width * -c.anchor.x,
                h = g.height * (1 - c.anchor.y),
                u = g.height * -c.anchor.y),
                r[o] = a * p,
                r[o + 1] = u * f,
                r[o + n] = s * p,
                r[o + n + 1] = u * f,
                r[o + 2 * n] = s * p,
                r[o + 2 * n + 1] = h * f,
                r[o + 3 * n] = a * p,
                r[o + 3 * n + 1] = h * f,
                o += 4 * n
            }
        }
        ,
        e.prototype.uploadPosition = function(t, e, i, r, n, o) {
            for (var s = 0; s < i; s++) {
                var a = t[e + s].position;
                r[o] = a.x,
                r[o + 1] = a.y,
                r[o + n] = a.x,
                r[o + n + 1] = a.y,
                r[o + 2 * n] = a.x,
                r[o + 2 * n + 1] = a.y,
                r[o + 3 * n] = a.x,
                r[o + 3 * n + 1] = a.y,
                o += 4 * n
            }
        }
        ,
        e.prototype.uploadRotation = function(t, e, i, r, n, o) {
            for (var s = 0; s < i; s++) {
                var a = t[e + s].rotation;
                r[o] = a,
                r[o + n] = a,
                r[o + 2 * n] = a,
                r[o + 3 * n] = a,
                o += 4 * n
            }
        }
        ,
        e.prototype.uploadUvs = function(t, e, i, r, n, o) {
            for (var s = 0; s < i; ++s) {
                var a = t[e + s]._texture._uvs;
                a ? (r[o] = a.x0,
                r[o + 1] = a.y0,
                r[o + n] = a.x1,
                r[o + n + 1] = a.y1,
                r[o + 2 * n] = a.x2,
                r[o + 2 * n + 1] = a.y2,
                r[o + 3 * n] = a.x3,
                r[o + 3 * n + 1] = a.y3,
                o += 4 * n) : (r[o] = 0,
                r[o + 1] = 0,
                r[o + n] = 0,
                r[o + n + 1] = 0,
                r[o + 2 * n] = 0,
                r[o + 2 * n + 1] = 0,
                r[o + 3 * n] = 0,
                r[o + 3 * n + 1] = 0,
                o += 4 * n)
            }
        }
        ,
        e.prototype.uploadTint = function(t, e, i, r, n, o) {
            for (var s = 0; s < i; ++s) {
                var a = t[e + s]
                  , h = a._texture.baseTexture.premultiplyAlpha
                  , u = a.alpha
                  , l = u < 1 && h ? K(a._tintRGB, u) : a._tintRGB + (255 * u << 24);
                r[o] = l,
                r[o + n] = l,
                r[o + 2 * n] = l,
                r[o + 3 * n] = l,
                o += 4 * n
            }
        }
        ,
        e.prototype.destroy = function() {
            t.prototype.destroy.call(this),
            this.shader && (this.shader.destroy(),
            this.shader = null),
            this.tempMatrix = null
        }
        ,
        e
    }(Qr)
      , Ls = function(t, e, i) {
        void 0 === i && (i = null),
        this.baseTexture = t,
        this.textures = {},
        this.animations = {},
        this.data = e,
        this.resolution = this._updateResolution(i || (this.baseTexture.resource ? this.baseTexture.resource.url : null)),
        this._frames = this.data.frames,
        this._frameKeys = Object.keys(this._frames),
        this._batchIndex = 0,
        this._callback = null
    }
      , Ns = {
        BATCH_SIZE: {
            configurable: !0
        }
    };
    Ns.BATCH_SIZE.get = function() {
        return 1e3
    }
    ,
    Ls.prototype._updateResolution = function(t) {
        var e = this.data.meta.scale
          , i = lt(t, null);
        return null === i && (i = void 0 !== e ? parseFloat(e) : 1),
        1 !== i && this.baseTexture.setResolution(i),
        i
    }
    ,
    Ls.prototype.parse = function(t) {
        this._batchIndex = 0,
        this._callback = t,
        this._frameKeys.length <= Ls.BATCH_SIZE ? (this._processFrames(0),
        this._processAnimations(),
        this._parseComplete()) : this._nextBatch()
    }
    ,
    Ls.prototype._processFrames = function(t) {
        for (var e = t, i = Ls.BATCH_SIZE; e - t < i && e < this._frameKeys.length; ) {
            var r = this._frameKeys[e]
              , n = this._frames[r]
              , o = n.frame;
            if (o) {
                var s = null
                  , a = null
                  , h = !1 !== n.trimmed && n.sourceSize ? n.sourceSize : n.frame
                  , u = new Yi(0,0,Math.floor(h.w) / this.resolution,Math.floor(h.h) / this.resolution);
                s = n.rotated ? new Yi(Math.floor(o.x) / this.resolution,Math.floor(o.y) / this.resolution,Math.floor(o.h) / this.resolution,Math.floor(o.w) / this.resolution) : new Yi(Math.floor(o.x) / this.resolution,Math.floor(o.y) / this.resolution,Math.floor(o.w) / this.resolution,Math.floor(o.h) / this.resolution),
                !1 !== n.trimmed && n.spriteSourceSize && (a = new Yi(Math.floor(n.spriteSourceSize.x) / this.resolution,Math.floor(n.spriteSourceSize.y) / this.resolution,Math.floor(o.w) / this.resolution,Math.floor(o.h) / this.resolution)),
                this.textures[r] = new Lr(this.baseTexture,s,u,a,n.rotated ? 2 : 0,n.anchor),
                Lr.addToCache(this.textures[r], r)
            }
            e++
        }
    }
    ,
    Ls.prototype._processAnimations = function() {
        var t = this.data.animations || {};
        for (var e in t) {
            this.animations[e] = [];
            for (var i = 0; i < t[e].length; i++) {
                var r = t[e][i];
                this.animations[e].push(this.textures[r])
            }
        }
    }
    ,
    Ls.prototype._parseComplete = function() {
        var t = this._callback;
        this._callback = null,
        this._batchIndex = 0,
        t.call(this, this.textures)
    }
    ,
    Ls.prototype._nextBatch = function() {
        var t = this;
        this._processFrames(this._batchIndex * Ls.BATCH_SIZE),
        this._batchIndex++,
        setTimeout(function() {
            t._batchIndex * Ls.BATCH_SIZE < t._frameKeys.length ? t._nextBatch() : (t._processAnimations(),
            t._parseComplete())
        }, 0)
    }
    ,
    Ls.prototype.destroy = function(t) {
        void 0 === t && (t = !1);
        for (var e in this.textures)
            this.textures[e].destroy();
        this._frames = null,
        this._frameKeys = null,
        this.data = null,
        this.textures = null,
        t && this.baseTexture.destroy(),
        this.baseTexture = null
    }
    ,
    Object.defineProperties(Ls, Ns);
    var Bs = function() {};
    Bs.use = function(t, e) {
        var i = t.name + "_image";
        if (!t.data || t.type !== Os.TYPE.JSON || !t.data.frames || this.resources[i])
            return void e();
        var r = {
            crossOrigin: t.crossOrigin,
            metadata: t.metadata.imageMetadata,
            parentResource: t
        }
          , n = Bs.getResourcePath(t, this.baseUrl);
        this.add(i, n, r, function(i) {
            if (i.error)
                return void e(i.error);
            var r = new Ls(i.texture.baseTexture,t.data,t.url);
            r.parse(function() {
                t.spritesheet = r,
                t.textures = r.textures,
                e()
            })
        })
    }
    ,
    Bs.getResourcePath = function(t, e) {
        return t.isDataUrl ? t.data.meta.image : ti.resolve(t.url.replace(e, ""), t.data.meta.image)
    }
    ;
    var Us = new Pi
      , ks = function(t) {
        function e(e, i, r) {
            void 0 === i && (i = 100),
            void 0 === r && (r = 100),
            t.call(this, e),
            this.tileTransform = new zi,
            this._width = i,
            this._height = r,
            this._canvasPattern = null,
            this.uvMatrix = e.uvMatrix || new On(e),
            this.pluginName = "tilingSprite",
            this.uvRespectAnchor = !1
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            clampMargin: {
                configurable: !0
            },
            tileScale: {
                configurable: !0
            },
            tilePosition: {
                configurable: !0
            },
            width: {
                configurable: !0
            },
            height: {
                configurable: !0
            }
        };
        return i.clampMargin.get = function() {
            return this.uvMatrix.clampMargin
        }
        ,
        i.clampMargin.set = function(t) {
            this.uvMatrix.clampMargin = t,
            this.uvMatrix.update(!0)
        }
        ,
        i.tileScale.get = function() {
            return this.tileTransform.scale
        }
        ,
        i.tileScale.set = function(t) {
            this.tileTransform.scale.copyFrom(t)
        }
        ,
        i.tilePosition.get = function() {
            return this.tileTransform.position
        }
        ,
        i.tilePosition.set = function(t) {
            this.tileTransform.position.copyFrom(t)
        }
        ,
        e.prototype._onTextureUpdate = function() {
            this.uvMatrix && (this.uvMatrix.texture = this._texture),
            this._cachedTint = 16777215
        }
        ,
        e.prototype._render = function(t) {
            var e = this._texture;
            e && e.valid && (this.tileTransform.updateLocalTransform(),
            this.uvMatrix.update(),
            t.batch.setObjectRenderer(t.plugins[this.pluginName]),
            t.plugins[this.pluginName].render(this))
        }
        ,
        e.prototype._calculateBounds = function() {
            var t = this._width * -this._anchor._x
              , e = this._height * -this._anchor._y
              , i = this._width * (1 - this._anchor._x)
              , r = this._height * (1 - this._anchor._y);
            this._bounds.addFrame(this.transform, t, e, i, r)
        }
        ,
        e.prototype.getLocalBounds = function(e) {
            return 0 === this.children.length ? (this._bounds.minX = this._width * -this._anchor._x,
            this._bounds.minY = this._height * -this._anchor._y,
            this._bounds.maxX = this._width * (1 - this._anchor._x),
            this._bounds.maxY = this._height * (1 - this._anchor._y),
            e || (this._localBoundsRect || (this._localBoundsRect = new Yi),
            e = this._localBoundsRect),
            this._bounds.getRectangle(e)) : t.prototype.getLocalBounds.call(this, e)
        }
        ,
        e.prototype.containsPoint = function(t) {
            this.worldTransform.applyInverse(t, Us);
            var e = this._width
              , i = this._height
              , r = -e * this.anchor._x;
            if (Us.x >= r && Us.x < r + e) {
                var n = -i * this.anchor._y;
                if (Us.y >= n && Us.y < n + i)
                    return !0
            }
            return !1
        }
        ,
        e.prototype.destroy = function(e) {
            t.prototype.destroy.call(this, e),
            this.tileTransform = null,
            this.uvMatrix = null
        }
        ,
        e.from = function(t, i, r) {
            return new e(Lr.from(t),i,r)
        }
        ,
        e.fromFrame = function(t, i, r) {
            var n = _i[t];
            if (!n)
                throw new Error('The frameId "' + t + '" does not exist in the texture cache ' + this);
            return new e(n,i,r)
        }
        ,
        e.fromImage = function(t, i, r, n) {
            return n && "object" != typeof n && (n = {
                scaleMode: arguments[4],
                resourceOptions: {
                    crossorigin: arguments[3]
                }
            }),
            new e(Lr.from(t, n),i,r)
        }
        ,
        i.width.get = function() {
            return this._width
        }
        ,
        i.width.set = function(t) {
            this._width = t
        }
        ,
        i.height.get = function() {
            return this._height
        }
        ,
        i.height.set = function(t) {
            this._height = t
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Ko)
      , Xs = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTransform;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTransform * vec3(aTextureCoord, 1.0)).xy;\n}\n"
      , js = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\nuniform mat3 uMapCoord;\nuniform vec4 uClampFrame;\nuniform vec2 uClampOffset;\n\nvoid main(void)\n{\n    vec2 coord = mod(vTextureCoord - uClampOffset, vec2(1.0, 1.0)) + uClampOffset;\n    coord = (uMapCoord * vec3(coord, 1.0)).xy;\n    coord = clamp(coord, uClampFrame.xy, uClampFrame.zw);\n\n    vec4 sample = texture2D(uSampler, coord);\n    gl_FragColor = sample * uColor;\n}\n"
      , Gs = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform vec4 uColor;\n\nvoid main(void)\n{\n    vec4 sample = texture2D(uSampler, vTextureCoord);\n    gl_FragColor = sample * uColor;\n}\n"
      , Hs = new Fi
      , zs = function(t) {
        function e(e) {
            t.call(this, e);
            var i = {
                globals: this.renderer.globalUniforms
            };
            this.shader = bn.from(Xs, js, i),
            this.simpleShader = bn.from(Xs, Gs, i),
            this.quad = new Wr
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.render = function(t) {
            var e = this.renderer
              , i = this.quad
              , r = i.vertices;
            r[0] = r[6] = t._width * -t.anchor.x,
            r[1] = r[3] = t._height * -t.anchor.y,
            r[2] = r[4] = t._width * (1 - t.anchor.x),
            r[5] = r[7] = t._height * (1 - t.anchor.y),
            t.uvRespectAnchor && (r = i.uvs,
            r[0] = r[6] = -t.anchor.x,
            r[1] = r[3] = -t.anchor.y,
            r[2] = r[4] = 1 - t.anchor.x,
            r[5] = r[7] = 1 - t.anchor.y),
            i.invalidate();
            var n = t._texture
              , o = n.baseTexture
              , s = t.tileTransform.localTransform
              , a = t.uvMatrix
              , h = o.isPowerOfTwo && n.frame.width === o.width && n.frame.height === o.height;
            h && (o._glTextures[e.CONTEXT_UID] ? h = o.wrapMode !== ui.CLAMP : o.wrapMode === ui.CLAMP && (o.wrapMode = ui.REPEAT));
            var u = h ? this.simpleShader : this.shader
              , l = n.width
              , c = n.height
              , d = t._width
              , p = t._height;
            Hs.set(s.a * l / d, s.b * l / p, s.c * c / d, s.d * c / p, s.tx / d, s.ty / p),
            Hs.invert(),
            h ? Hs.prepend(a.mapCoord) : (u.uniforms.uMapCoord = a.mapCoord.toArray(!0),
            u.uniforms.uClampFrame = a.uClampFrame,
            u.uniforms.uClampOffset = a.uClampOffset),
            u.uniforms.uTransform = Hs.toArray(!0),
            u.uniforms.uColor = J(t.tint, t.worldAlpha, u.uniforms.uColor, o.premultiplyAlpha),
            u.uniforms.translationMatrix = t.transform.worldTransform.toArray(!0),
            u.uniforms.uSampler = n,
            e.shader.bind(u),
            e.geometry.bind(i),
            e.state.setBlendMode(q(t.blendMode, o.premultiplyAlpha)),
            e.geometry.draw(this.renderer.gl.TRIANGLES, 6, 0)
        }
        ,
        e
    }(Qr)
      , Vs = function(t) {
        function e(e, i) {
            var r = this;
            void 0 === i && (i = {}),
            t.call(this),
            this._textWidth = 0,
            this._textHeight = 0,
            this._glyphs = [],
            this._font = {
                tint: void 0 !== i.tint ? i.tint : 16777215,
                align: i.align || "left",
                name: null,
                size: 0
            },
            this.font = i.font,
            this._text = e,
            this._maxWidth = 0,
            this._maxLineHeight = 0,
            this._letterSpacing = 0,
            this._anchor = new Ai(function() {
                r.dirty = !0
            }
            ,this,0,0),
            this.dirty = !1,
            this.roundPixels = Ie.ROUND_PIXELS,
            this.updateText()
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            tint: {
                configurable: !0
            },
            align: {
                configurable: !0
            },
            anchor: {
                configurable: !0
            },
            font: {
                configurable: !0
            },
            text: {
                configurable: !0
            },
            maxWidth: {
                configurable: !0
            },
            maxLineHeight: {
                configurable: !0
            },
            textWidth: {
                configurable: !0
            },
            letterSpacing: {
                configurable: !0
            },
            textHeight: {
                configurable: !0
            }
        };
        return e.prototype.updateText = function() {
            for (var t = e.fonts[this._font.name], i = this._font.size / t.size, r = new Pi, n = [], o = [], s = this._text.replace(/(?:\r\n|\r)/g, "\n") || " ", a = s.length, h = this._maxWidth * t.size / this._font.size, u = null, l = 0, c = 0, d = 0, p = -1, f = 0, v = 0, g = 0, m = 0; m < a; m++) {
                var y = s.charCodeAt(m)
                  , _ = s.charAt(m);
                if (/(?:\s)/.test(_) && (p = m,
                f = l),
                "\r" !== _ && "\n" !== _) {
                    var x = t.chars[y];
                    x && (u && x.kerning[u] && (r.x += x.kerning[u]),
                    n.push({
                        texture: x.texture,
                        line: d,
                        charCode: y,
                        position: new Pi(r.x + x.xOffset + this._letterSpacing / 2,r.y + x.yOffset)
                    }),
                    r.x += x.xAdvance + this._letterSpacing,
                    l = r.x,
                    g = Math.max(g, x.yOffset + x.texture.height),
                    u = y,
                    -1 !== p && h > 0 && r.x > h && (++v,
                    $(n, 1 + p - v, 1 + m - p),
                    m = p,
                    p = -1,
                    o.push(f),
                    c = Math.max(c, f),
                    d++,
                    r.x = 0,
                    r.y += t.lineHeight,
                    u = null))
                } else
                    o.push(l),
                    c = Math.max(c, l),
                    ++d,
                    ++v,
                    r.x = 0,
                    r.y += t.lineHeight,
                    u = null
            }
            var b = s.charAt(s.length - 1);
            "\r" !== b && "\n" !== b && (/(?:\s)/.test(b) && (l = f),
            o.push(l),
            c = Math.max(c, l));
            for (var T = [], w = 0; w <= d; w++) {
                var E = 0;
                "right" === this._font.align ? E = c - o[w] : "center" === this._font.align && (E = (c - o[w]) / 2),
                T.push(E)
            }
            for (var S = n.length, I = this.tint, P = 0; P < S; P++) {
                var A = this._glyphs[P];
                A ? A.texture = n[P].texture : (A = new Ko(n[P].texture),
                A.roundPixels = this.roundPixels,
                this._glyphs.push(A)),
                A.position.x = (n[P].position.x + T[n[P].line]) * i,
                A.position.y = n[P].position.y * i,
                A.scale.x = A.scale.y = i,
                A.tint = I,
                A.parent || this.addChild(A)
            }
            for (var O = S; O < this._glyphs.length; ++O)
                this.removeChild(this._glyphs[O]);
            if (this._textWidth = c * i,
            this._textHeight = (r.y + t.lineHeight) * i,
            0 !== this.anchor.x || 0 !== this.anchor.y)
                for (var C = 0; C < S; C++)
                    this._glyphs[C].x -= this._textWidth * this.anchor.x,
                    this._glyphs[C].y -= this._textHeight * this.anchor.y;
            this._maxLineHeight = g * i
        }
        ,
        e.prototype.updateTransform = function() {
            this.validate(),
            this.containerUpdateTransform()
        }
        ,
        e.prototype.getLocalBounds = function() {
            return this.validate(),
            t.prototype.getLocalBounds.call(this)
        }
        ,
        e.prototype.validate = function() {
            this.dirty && (this.updateText(),
            this.dirty = !1)
        }
        ,
        i.tint.get = function() {
            return this._font.tint
        }
        ,
        i.tint.set = function(t) {
            this._font.tint = "number" == typeof t && t >= 0 ? t : 16777215,
            this.dirty = !0
        }
        ,
        i.align.get = function() {
            return this._font.align
        }
        ,
        i.align.set = function(t) {
            this._font.align = t || "left",
            this.dirty = !0
        }
        ,
        i.anchor.get = function() {
            return this._anchor
        }
        ,
        i.anchor.set = function(t) {
            "number" == typeof t ? this._anchor.set(t) : this._anchor.copyFrom(t)
        }
        ,
        i.font.get = function() {
            return this._font
        }
        ,
        i.font.set = function(t) {
            t && ("string" == typeof t ? (t = t.split(" "),
            this._font.name = 1 === t.length ? t[0] : t.slice(1).join(" "),
            this._font.size = t.length >= 2 ? parseInt(t[0], 10) : e.fonts[this._font.name].size) : (this._font.name = t.name,
            this._font.size = "number" == typeof t.size ? t.size : parseInt(t.size, 10)),
            this.dirty = !0)
        }
        ,
        i.text.get = function() {
            return this._text
        }
        ,
        i.text.set = function(t) {
            t = String(null === t || void 0 === t ? "" : t),
            this._text !== t && (this._text = t,
            this.dirty = !0)
        }
        ,
        i.maxWidth.get = function() {
            return this._maxWidth
        }
        ,
        i.maxWidth.set = function(t) {
            this._maxWidth !== t && (this._maxWidth = t,
            this.dirty = !0)
        }
        ,
        i.maxLineHeight.get = function() {
            return this.validate(),
            this._maxLineHeight
        }
        ,
        i.textWidth.get = function() {
            return this.validate(),
            this._textWidth
        }
        ,
        i.letterSpacing.get = function() {
            return this._letterSpacing
        }
        ,
        i.letterSpacing.set = function(t) {
            this._letterSpacing !== t && (this._letterSpacing = t,
            this.dirty = !0)
        }
        ,
        i.textHeight.get = function() {
            return this.validate(),
            this._textHeight
        }
        ,
        e.registerFont = function(t, i) {
            var r = {}
              , n = t.getElementsByTagName("info")[0]
              , o = t.getElementsByTagName("common")[0]
              , s = t.getElementsByTagName("page")
              , a = lt(s[0].getAttribute("file"), Ie.RESOLUTION)
              , h = {};
            r.font = n.getAttribute("face"),
            r.size = parseInt(n.getAttribute("size"), 10),
            r.lineHeight = parseInt(o.getAttribute("lineHeight"), 10) / a,
            r.chars = {},
            i instanceof Lr && (i = [i]);
            for (var u = 0; u < s.length; u++) {
                var l = s[u].getAttribute("id")
                  , c = s[u].getAttribute("file");
                h[l] = i instanceof Array ? i[u] : i[c]
            }
            for (var d = t.getElementsByTagName("char"), p = 0; p < d.length; p++) {
                var f = d[p]
                  , v = parseInt(f.getAttribute("id"), 10)
                  , g = f.getAttribute("page") || 0
                  , m = new Yi(parseInt(f.getAttribute("x"), 10) / a + h[g].frame.x / a,parseInt(f.getAttribute("y"), 10) / a + h[g].frame.y / a,parseInt(f.getAttribute("width"), 10) / a,parseInt(f.getAttribute("height"), 10) / a);
                r.chars[v] = {
                    xOffset: parseInt(f.getAttribute("xoffset"), 10) / a,
                    yOffset: parseInt(f.getAttribute("yoffset"), 10) / a,
                    xAdvance: parseInt(f.getAttribute("xadvance"), 10) / a,
                    kerning: {},
                    texture: new Lr(h[g].baseTexture,m),
                    page: g
                }
            }
            for (var y = t.getElementsByTagName("kerning"), _ = 0; _ < y.length; _++) {
                var x = y[_]
                  , b = parseInt(x.getAttribute("first"), 10) / a
                  , T = parseInt(x.getAttribute("second"), 10) / a
                  , w = parseInt(x.getAttribute("amount"), 10) / a;
                r.chars[T] && (r.chars[T].kerning[b] = w)
            }
            return e.fonts[r.font] = r,
            r
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(er);
    Vs.fonts = {};
    var Ys = function() {};
    Ys.parse = function(t, e) {
        t.bitmapFont = Vs.registerFont(t.data, e)
    }
    ,
    Ys.add = function() {
        Os.setExtensionXhrType("fnt", Os.XHR_RESPONSE_TYPE.DOCUMENT)
    }
    ,
    Ys.dirname = function(t) {
        var e = t.replace(/\/$/, "").replace(/\/[^\/]*$/, "");
        return e === t ? "." : "" === e ? "/" : e
    }
    ,
    Ys.use = function(t, e) {
        if (!t.data || t.type !== Os.TYPE.XML)
            return void e();
        if (0 === t.data.getElementsByTagName("page").length || 0 === t.data.getElementsByTagName("info").length || null === t.data.getElementsByTagName("info")[0].getAttribute("face"))
            return void e();
        var i = t.isDataUrl ? "" : Ys.dirname(t.url);
        t.isDataUrl && ("." === i && (i = ""),
        this.baseUrl && i && "/" === this.baseUrl.charAt(this.baseUrl.length - 1) && (i += "/")),
        (i = i.replace(this.baseUrl, "")) && "/" !== i.charAt(i.length - 1) && (i += "/");
        for (var r = t.data.getElementsByTagName("page"), n = {}, o = function(i) {
            n[i.metadata.pageFile] = i.texture,
            Object.keys(n).length === r.length && (Ys.parse(t, n),
            e())
        }, s = 0; s < r.length; ++s) {
            var a = r[s].getAttribute("file")
              , h = i + a
              , u = !1;
            for (var l in this.resources) {
                var c = this.resources[l];
                if (c.url === h) {
                    c.metadata.pageFile = a,
                    c.texture ? o(c) : c.onAfterMiddleware.add(o),
                    u = !0;
                    break
                }
            }
            if (!u) {
                var d = {
                    crossOrigin: t.crossOrigin,
                    loadType: Os.LOAD_TYPE.IMAGE,
                    metadata: Object.assign({
                        pageFile: a
                    }, t.metadata.imageMetadata),
                    parentResource: t
                };
                this.add(h, d, o)
            }
        }
    }
    ;
    var Ws = "varying vec2 vTextureCoord;\n\nuniform sampler2D uSampler;\nuniform float uAlpha;\n\nvoid main(void)\n{\n   gl_FragColor = texture2D(uSampler, vTextureCoord) * uAlpha;\n}\n"
      , qs = function(t) {
        function e(e) {
            void 0 === e && (e = 1),
            t.call(this, $n, Ws, {
                uAlpha: 1
            }),
            this.alpha = e
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            alpha: {
                configurable: !0
            }
        };
        return i.alpha.get = function() {
            return this.uniforms.uAlpha
        }
        ,
        i.alpha.set = function(t) {
            this.uniforms.uAlpha = t
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Sn)
      , Zs = "\n    attribute vec2 aVertexPosition;\n\n    uniform mat3 projectionMatrix;\n\n    uniform float strength;\n\n    varying vec2 vBlurTexCoords[%size%];\n\n    uniform vec4 inputSize;\n    uniform vec4 outputFrame;\n    \n    vec4 filterVertexPosition( void )\n    {\n        vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n    \n        return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n    }\n    \n    vec2 filterTextureCoord( void )\n    {\n        return aVertexPosition * (outputFrame.zw * inputSize.zw);\n    }\n\n    void main(void)\n    {\n        gl_Position = filterVertexPosition();\n\n        vec2 textureCoord = filterTextureCoord();\n        %blur%\n    }"
      , Ks = {
        5: [.153388, .221461, .250301],
        7: [.071303, .131514, .189879, .214607],
        9: [.028532, .067234, .124009, .179044, .20236],
        11: [.0093, .028002, .065984, .121703, .175713, .198596],
        13: [.002406, .009255, .027867, .065666, .121117, .174868, .197641],
        15: [489e-6, .002403, .009246, .02784, .065602, .120999, .174697, .197448]
    }
      , Js = ["varying vec2 vBlurTexCoords[%size%];", "uniform sampler2D uSampler;", "void main(void)", "{", "    gl_FragColor = vec4(0.0);", "    %blur%", "}"].join("\n")
      , Qs = function(t) {
        function e(e, i, r, n, o) {
            o = o || 5;
            var s = ue(o, e)
              , a = le(o);
            t.call(this, s, a),
            this.horizontal = e,
            this.resolution = n || Ie.RESOLUTION,
            this._quality = 0,
            this.quality = r || 4,
            this.blur = i || 8
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            blur: {
                configurable: !0
            },
            quality: {
                configurable: !0
            }
        };
        return e.prototype.apply = function(t, e, i, r) {
            if (i ? this.horizontal ? this.uniforms.strength = 1 / i.width * (i.width / e.width) : this.uniforms.strength = 1 / i.height * (i.height / e.height) : this.horizontal ? this.uniforms.strength = 1 / t.renderer.width * (t.renderer.width / e.width) : this.uniforms.strength = 1 / t.renderer.height * (t.renderer.height / e.height),
            this.uniforms.strength *= this.strength,
            this.uniforms.strength /= this.passes,
            1 === this.passes)
                t.applyFilter(this, e, i, r);
            else {
                var n = t.getFilterTexture()
                  , o = t.renderer
                  , s = e
                  , a = n;
                this.state.blend = !1,
                t.applyFilter(this, s, a, !1);
                for (var h = 1; h < this.passes - 1; h++) {
                    o.renderTexture.bind(s, s.filterFrame),
                    this.uniforms.uSampler = a;
                    var u = a;
                    a = s,
                    s = u,
                    o.shader.bind(this),
                    o.geometry.draw(5)
                }
                this.state.blend = !0,
                t.applyFilter(this, a, i, r),
                t.returnFilterTexture(n)
            }
        }
        ,
        i.blur.get = function() {
            return this.strength
        }
        ,
        i.blur.set = function(t) {
            this.padding = 1 + 2 * Math.abs(t),
            this.strength = t
        }
        ,
        i.quality.get = function() {
            return this._quality
        }
        ,
        i.quality.set = function(t) {
            this._quality = t,
            this.passes = t
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Sn)
      , $s = function(t) {
        function e(e, i, r, n) {
            t.call(this),
            this.blurXFilter = new Qs(!0,e,i,r,n),
            this.blurYFilter = new Qs(!1,e,i,r,n),
            this.resolution = r || Ie.RESOLUTION,
            this.quality = i || 4,
            this.blur = e || 8,
            this.repeatEdgePixels = !1
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            blur: {
                configurable: !0
            },
            quality: {
                configurable: !0
            },
            blurX: {
                configurable: !0
            },
            blurY: {
                configurable: !0
            },
            blendMode: {
                configurable: !0
            },
            repeatEdgePixels: {
                configurable: !0
            }
        };
        return e.prototype.apply = function(t, e, i, r) {
            var n = Math.abs(this.blurXFilter.strength)
              , o = Math.abs(this.blurYFilter.strength);
            if (n && o) {
                var s = t.getFilterTexture();
                this.blurXFilter.apply(t, e, s, !0),
                this.blurYFilter.apply(t, s, i, r),
                t.returnFilterTexture(s)
            } else
                o ? this.blurYFilter.apply(t, e, i, r) : this.blurXFilter.apply(t, e, i, r)
        }
        ,
        e.prototype.updatePadding = function() {
            this._repeatEdgePixels ? this.padding = 0 : this.padding = 2 * Math.max(Math.abs(this.blurXFilter.strength), Math.abs(this.blurYFilter.strength))
        }
        ,
        i.blur.get = function() {
            return this.blurXFilter.blur
        }
        ,
        i.blur.set = function(t) {
            this.blurXFilter.blur = this.blurYFilter.blur = t,
            this.updatePadding()
        }
        ,
        i.quality.get = function() {
            return this.blurXFilter.quality
        }
        ,
        i.quality.set = function(t) {
            this.blurXFilter.quality = this.blurYFilter.quality = t
        }
        ,
        i.blurX.get = function() {
            return this.blurXFilter.blur
        }
        ,
        i.blurX.set = function(t) {
            this.blurXFilter.blur = t,
            this.updatePadding()
        }
        ,
        i.blurY.get = function() {
            return this.blurYFilter.blur
        }
        ,
        i.blurY.set = function(t) {
            this.blurYFilter.blur = t,
            this.updatePadding()
        }
        ,
        i.blendMode.get = function() {
            return this.blurYFilter.blendMode
        }
        ,
        i.blendMode.set = function(t) {
            this.blurYFilter.blendMode = t
        }
        ,
        i.repeatEdgePixels.get = function() {
            return this._repeatEdgePixels
        }
        ,
        i.repeatEdgePixels.set = function(t) {
            this._repeatEdgePixels = t,
            this.updatePadding()
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Sn)
      , ta = "varying vec2 vTextureCoord;\nuniform sampler2D uSampler;\nuniform float m[20];\nuniform float uAlpha;\n\nvoid main(void)\n{\n    vec4 c = texture2D(uSampler, vTextureCoord);\n\n    if (uAlpha == 0.0) {\n        gl_FragColor = c;\n        return;\n    }\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (c.a > 0.0) {\n      c.rgb /= c.a;\n    }\n\n    vec4 result;\n\n    result.r = (m[0] * c.r);\n        result.r += (m[1] * c.g);\n        result.r += (m[2] * c.b);\n        result.r += (m[3] * c.a);\n        result.r += m[4];\n\n    result.g = (m[5] * c.r);\n        result.g += (m[6] * c.g);\n        result.g += (m[7] * c.b);\n        result.g += (m[8] * c.a);\n        result.g += m[9];\n\n    result.b = (m[10] * c.r);\n       result.b += (m[11] * c.g);\n       result.b += (m[12] * c.b);\n       result.b += (m[13] * c.a);\n       result.b += m[14];\n\n    result.a = (m[15] * c.r);\n       result.a += (m[16] * c.g);\n       result.a += (m[17] * c.b);\n       result.a += (m[18] * c.a);\n       result.a += m[19];\n\n    vec3 rgb = mix(c.rgb, result.rgb, uAlpha);\n\n    // Premultiply alpha again.\n    rgb *= result.a;\n\n    gl_FragColor = vec4(rgb, result.a);\n}\n"
      , ea = function(t) {
        function e() {
            var e = {
                m: new Float32Array([1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0]),
                uAlpha: 1
            };
            t.call(this, to, ta, e),
            this.alpha = 1
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            matrix: {
                configurable: !0
            },
            alpha: {
                configurable: !0
            }
        };
        return e.prototype._loadMatrix = function(t, e) {
            void 0 === e && (e = !1);
            var i = t;
            e && (this._multiply(i, this.uniforms.m, t),
            i = this._colorMatrix(i)),
            this.uniforms.m = i
        }
        ,
        e.prototype._multiply = function(t, e, i) {
            return t[0] = e[0] * i[0] + e[1] * i[5] + e[2] * i[10] + e[3] * i[15],
            t[1] = e[0] * i[1] + e[1] * i[6] + e[2] * i[11] + e[3] * i[16],
            t[2] = e[0] * i[2] + e[1] * i[7] + e[2] * i[12] + e[3] * i[17],
            t[3] = e[0] * i[3] + e[1] * i[8] + e[2] * i[13] + e[3] * i[18],
            t[4] = e[0] * i[4] + e[1] * i[9] + e[2] * i[14] + e[3] * i[19] + e[4],
            t[5] = e[5] * i[0] + e[6] * i[5] + e[7] * i[10] + e[8] * i[15],
            t[6] = e[5] * i[1] + e[6] * i[6] + e[7] * i[11] + e[8] * i[16],
            t[7] = e[5] * i[2] + e[6] * i[7] + e[7] * i[12] + e[8] * i[17],
            t[8] = e[5] * i[3] + e[6] * i[8] + e[7] * i[13] + e[8] * i[18],
            t[9] = e[5] * i[4] + e[6] * i[9] + e[7] * i[14] + e[8] * i[19] + e[9],
            t[10] = e[10] * i[0] + e[11] * i[5] + e[12] * i[10] + e[13] * i[15],
            t[11] = e[10] * i[1] + e[11] * i[6] + e[12] * i[11] + e[13] * i[16],
            t[12] = e[10] * i[2] + e[11] * i[7] + e[12] * i[12] + e[13] * i[17],
            t[13] = e[10] * i[3] + e[11] * i[8] + e[12] * i[13] + e[13] * i[18],
            t[14] = e[10] * i[4] + e[11] * i[9] + e[12] * i[14] + e[13] * i[19] + e[14],
            t[15] = e[15] * i[0] + e[16] * i[5] + e[17] * i[10] + e[18] * i[15],
            t[16] = e[15] * i[1] + e[16] * i[6] + e[17] * i[11] + e[18] * i[16],
            t[17] = e[15] * i[2] + e[16] * i[7] + e[17] * i[12] + e[18] * i[17],
            t[18] = e[15] * i[3] + e[16] * i[8] + e[17] * i[13] + e[18] * i[18],
            t[19] = e[15] * i[4] + e[16] * i[9] + e[17] * i[14] + e[18] * i[19] + e[19],
            t
        }
        ,
        e.prototype._colorMatrix = function(t) {
            var e = new Float32Array(t);
            return e[4] /= 255,
            e[9] /= 255,
            e[14] /= 255,
            e[19] /= 255,
            e
        }
        ,
        e.prototype.brightness = function(t, e) {
            var i = [t, 0, 0, 0, 0, 0, t, 0, 0, 0, 0, 0, t, 0, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(i, e)
        }
        ,
        e.prototype.greyscale = function(t, e) {
            var i = [t, t, t, 0, 0, t, t, t, 0, 0, t, t, t, 0, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(i, e)
        }
        ,
        e.prototype.blackAndWhite = function(t) {
            var e = [.3, .6, .1, 0, 0, .3, .6, .1, 0, 0, .3, .6, .1, 0, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(e, t)
        }
        ,
        e.prototype.hue = function(t, e) {
            t = (t || 0) / 180 * Math.PI;
            var i = Math.cos(t)
              , r = Math.sin(t)
              , n = Math.sqrt
              , o = 1 / 3
              , s = n(o)
              , a = i + (1 - i) * o
              , h = o * (1 - i) - s * r
              , u = o * (1 - i) + s * r
              , l = o * (1 - i) + s * r
              , c = i + o * (1 - i)
              , d = o * (1 - i) - s * r
              , p = o * (1 - i) - s * r
              , f = o * (1 - i) + s * r
              , v = i + o * (1 - i)
              , g = [a, h, u, 0, 0, l, c, d, 0, 0, p, f, v, 0, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(g, e)
        }
        ,
        e.prototype.contrast = function(t, e) {
            var i = (t || 0) + 1
              , r = -.5 * (i - 1)
              , n = [i, 0, 0, 0, r, 0, i, 0, 0, r, 0, 0, i, 0, r, 0, 0, 0, 1, 0];
            this._loadMatrix(n, e)
        }
        ,
        e.prototype.saturate = function(t, e) {
            void 0 === t && (t = 0);
            var i = 2 * t / 3 + 1
              , r = -.5 * (i - 1)
              , n = [i, r, r, 0, 0, r, i, r, 0, 0, r, r, i, 0, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(n, e)
        }
        ,
        e.prototype.desaturate = function() {
            this.saturate(-1)
        }
        ,
        e.prototype.negative = function(t) {
            var e = [-1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, -1, 1, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(e, t)
        }
        ,
        e.prototype.sepia = function(t) {
            var e = [.393, .7689999, .18899999, 0, 0, .349, .6859999, .16799999, 0, 0, .272, .5339999, .13099999, 0, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(e, t)
        }
        ,
        e.prototype.technicolor = function(t) {
            var e = [1.9125277891456083, -.8545344976951645, -.09155508482755585, 0, 11.793603434377337, -.3087833385928097, 1.7658908555458428, -.10601743074722245, 0, -70.35205161461398, -.231103377548616, -.7501899197440212, 1.847597816108189, 0, 30.950940869491138, 0, 0, 0, 1, 0];
            this._loadMatrix(e, t)
        }
        ,
        e.prototype.polaroid = function(t) {
            var e = [1.438, -.062, -.062, 0, 0, -.122, 1.378, -.122, 0, 0, -.016, -.016, 1.483, 0, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(e, t)
        }
        ,
        e.prototype.toBGR = function(t) {
            var e = [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(e, t)
        }
        ,
        e.prototype.kodachrome = function(t) {
            var e = [1.1285582396593525, -.3967382283601348, -.03992559172921793, 0, 63.72958762196502, -.16404339962244616, 1.0835251566291304, -.05498805115633132, 0, 24.732407896706203, -.16786010706155763, -.5603416277695248, 1.6014850761964943, 0, 35.62982807460946, 0, 0, 0, 1, 0];
            this._loadMatrix(e, t)
        }
        ,
        e.prototype.browni = function(t) {
            var e = [.5997023498159715, .34553243048391263, -.2708298674538042, 0, 47.43192855600873, -.037703249837783157, .8609577587992641, .15059552388459913, 0, -36.96841498319127, .24113635128153335, -.07441037908422492, .44972182064877153, 0, -7.562075277591283, 0, 0, 0, 1, 0];
            this._loadMatrix(e, t)
        }
        ,
        e.prototype.vintage = function(t) {
            var e = [.6279345635605994, .3202183420819367, -.03965408211312453, 0, 9.651285835294123, .02578397704808868, .6441188644374771, .03259127616149294, 0, 7.462829176470591, .0466055556782719, -.0851232987247891, .5241648018700465, 0, 5.159190588235296, 0, 0, 0, 1, 0];
            this._loadMatrix(e, t)
        }
        ,
        e.prototype.colorTone = function(t, e, i, r, n) {
            t = t || .2,
            e = e || .15,
            i = i || 16770432,
            r = r || 3375104;
            var o = (i >> 16 & 255) / 255
              , s = (i >> 8 & 255) / 255
              , a = (255 & i) / 255
              , h = (r >> 16 & 255) / 255
              , u = (r >> 8 & 255) / 255
              , l = (255 & r) / 255
              , c = [.3, .59, .11, 0, 0, o, s, a, t, 0, h, u, l, e, 0, o - h, s - u, a - l, 0, 0];
            this._loadMatrix(c, n)
        }
        ,
        e.prototype.night = function(t, e) {
            t = t || .1;
            var i = [-2 * t, -t, 0, 0, 0, -t, 0, t, 0, 0, 0, t, 2 * t, 0, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(i, e)
        }
        ,
        e.prototype.predator = function(t, e) {
            var i = [11.224130630493164 * t, -4.794486999511719 * t, -2.8746118545532227 * t, 0 * t, .40342438220977783 * t, -3.6330697536468506 * t, 9.193157196044922 * t, -2.951810836791992 * t, 0 * t, -1.316135048866272 * t, -3.2184197902679443 * t, -4.2375030517578125 * t, 7.476448059082031 * t, 0 * t, .8044459223747253 * t, 0, 0, 0, 1, 0];
            this._loadMatrix(i, e)
        }
        ,
        e.prototype.lsd = function(t) {
            var e = [2, -.4, .5, 0, 0, -.5, 2, -.4, 0, 0, -.4, -.5, 3, 0, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(e, t)
        }
        ,
        e.prototype.reset = function() {
            var t = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
            this._loadMatrix(t, !1)
        }
        ,
        i.matrix.get = function() {
            return this.uniforms.m
        }
        ,
        i.matrix.set = function(t) {
            this.uniforms.m = t
        }
        ,
        i.alpha.get = function() {
            return this.uniforms.uAlpha
        }
        ,
        i.alpha.set = function(t) {
            this.uniforms.uAlpha = t
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Sn);
    ea.prototype.grayscale = ea.prototype.greyscale;
    var ia = "attribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nuniform vec4 inputSize;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvec2 filterTextureCoord( void )\n{\n    return aVertexPosition * (outputFrame.zw * inputSize.zw);\n}\n\nvoid main(void)\n{\n\tgl_Position = filterVertexPosition();\n\tvTextureCoord = filterTextureCoord();\n\tvFilterCoord = ( filterMatrix * vec3( vTextureCoord, 1.0)  ).xy;\n}\n"
      , ra = "varying vec2 vFilterCoord;\nvarying vec2 vTextureCoord;\n\nuniform vec2 scale;\nuniform mat2 rotation;\nuniform sampler2D uSampler;\nuniform sampler2D mapSampler;\n\nuniform highp vec4 inputSize;\nuniform vec4 inputClamp;\n\nvoid main(void)\n{\n  vec4 map =  texture2D(mapSampler, vFilterCoord);\n\n  map -= 0.5;\n  map.xy = scale * inputSize.zw * (rotation * map.xy);\n\n  gl_FragColor = texture2D(uSampler, clamp(vec2(vTextureCoord.x + map.x, vTextureCoord.y + map.y), inputClamp.xy, inputClamp.zw));\n}\n"
      , na = function(t) {
        function e(e, i) {
            var r = new Fi;
            e.renderable = !1,
            t.call(this, ia, ra, {
                mapSampler: e._texture,
                filterMatrix: r,
                scale: {
                    x: 1,
                    y: 1
                },
                rotation: new Float32Array([1, 0, 0, 1])
            }),
            this.maskSprite = e,
            this.maskMatrix = r,
            null !== i && void 0 !== i || (i = 20),
            this.scale = new Pi(i,i)
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            map: {
                configurable: !0
            }
        };
        return e.prototype.apply = function(t, e, i, r) {
            this.uniforms.filterMatrix = t.calculateSpriteMatrix(this.maskMatrix, this.maskSprite),
            this.uniforms.scale.x = this.scale.x,
            this.uniforms.scale.y = this.scale.y;
            var n = this.maskSprite.transform.worldTransform
              , o = Math.sqrt(n.a * n.a + n.b * n.b)
              , s = Math.sqrt(n.c * n.c + n.d * n.d);
            0 !== o && 0 !== s && (this.uniforms.rotation[0] = n.a / o,
            this.uniforms.rotation[1] = n.b / o,
            this.uniforms.rotation[2] = n.c / s,
            this.uniforms.rotation[3] = n.d / s),
            t.applyFilter(this, e, i, r)
        }
        ,
        i.map.get = function() {
            return this.uniforms.mapSampler
        }
        ,
        i.map.set = function(t) {
            this.uniforms.mapSampler = t
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Sn)
      , oa = "\nattribute vec2 aVertexPosition;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\n\nuniform vec4 inputPixel;\nuniform vec4 outputFrame;\n\nvec4 filterVertexPosition( void )\n{\n    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;\n\n    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);\n}\n\nvoid texcoords(vec2 fragCoord, vec2 inverseVP,\n               out vec2 v_rgbNW, out vec2 v_rgbNE,\n               out vec2 v_rgbSW, out vec2 v_rgbSE,\n               out vec2 v_rgbM) {\n    v_rgbNW = (fragCoord + vec2(-1.0, -1.0)) * inverseVP;\n    v_rgbNE = (fragCoord + vec2(1.0, -1.0)) * inverseVP;\n    v_rgbSW = (fragCoord + vec2(-1.0, 1.0)) * inverseVP;\n    v_rgbSE = (fragCoord + vec2(1.0, 1.0)) * inverseVP;\n    v_rgbM = vec2(fragCoord * inverseVP);\n}\n\nvoid main(void) {\n\n   gl_Position = filterVertexPosition();\n\n   vFragCoord = aVertexPosition * outputFrame.zw;\n\n   texcoords(vFragCoord, inputPixel.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n}\n"
      , sa = 'varying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nvarying vec2 vFragCoord;\nuniform sampler2D uSampler;\nuniform highp vec4 inputPixel;\n\n\n/**\n Basic FXAA implementation based on the code on geeks3d.com with the\n modification that the texture2DLod stuff was removed since it\'s\n unsupported by WebGL.\n\n --\n\n From:\n https://github.com/mitsuhiko/webgl-meincraft\n\n Copyright (c) 2011 by Armin Ronacher.\n\n Some rights reserved.\n\n Redistribution and use in source and binary forms, with or without\n modification, are permitted provided that the following conditions are\n met:\n\n * Redistributions of source code must retain the above copyright\n notice, this list of conditions and the following disclaimer.\n\n * Redistributions in binary form must reproduce the above\n copyright notice, this list of conditions and the following\n disclaimer in the documentation and/or other materials provided\n with the distribution.\n\n * The names of the contributors may not be used to endorse or\n promote products derived from this software without specific\n prior written permission.\n\n THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS\n "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT\n LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR\n A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT\n OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,\n SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT\n LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,\n DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY\n THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT\n (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE\n OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.\n */\n\n#ifndef FXAA_REDUCE_MIN\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#endif\n#ifndef FXAA_REDUCE_MUL\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#endif\n#ifndef FXAA_SPAN_MAX\n#define FXAA_SPAN_MAX     8.0\n#endif\n\n//optimized version for mobile, where dependent\n//texture reads can be a bottleneck\nvec4 fxaa(sampler2D tex, vec2 fragCoord, vec2 inverseVP,\n          vec2 v_rgbNW, vec2 v_rgbNE,\n          vec2 v_rgbSW, vec2 v_rgbSE,\n          vec2 v_rgbM) {\n    vec4 color;\n    vec3 rgbNW = texture2D(tex, v_rgbNW).xyz;\n    vec3 rgbNE = texture2D(tex, v_rgbNE).xyz;\n    vec3 rgbSW = texture2D(tex, v_rgbSW).xyz;\n    vec3 rgbSE = texture2D(tex, v_rgbSE).xyz;\n    vec4 texColor = texture2D(tex, v_rgbM);\n    vec3 rgbM  = texColor.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n    mediump vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n                  dir * rcpDirMin)) * inverseVP;\n\n    vec3 rgbA = 0.5 * (\n                       texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n                       texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    vec3 rgbB = rgbA * 0.5 + 0.25 * (\n                                     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n                                     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    float lumaB = dot(rgbB, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = vec4(rgbA, texColor.a);\n    else\n        color = vec4(rgbB, texColor.a);\n    return color;\n}\n\nvoid main() {\n\n      vec4 color;\n\n      color = fxaa(uSampler, vFragCoord, inputPixel.zw, v_rgbNW, v_rgbNE, v_rgbSW, v_rgbSE, v_rgbM);\n\n      gl_FragColor = color;\n}\n'
      , aa = function(t) {
        function e() {
            t.call(this, oa, sa)
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e
    }(Sn)
      , ha = "precision highp float;\n\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform float uNoise;\nuniform float uSeed;\nuniform sampler2D uSampler;\n\nfloat rand(vec2 co)\n{\n    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n\nvoid main()\n{\n    vec4 color = texture2D(uSampler, vTextureCoord);\n    float randomValue = rand(gl_FragCoord.xy * uSeed);\n    float diff = (randomValue - 0.5) * uNoise;\n\n    // Un-premultiply alpha before applying the color matrix. See issue #3539.\n    if (color.a > 0.0) {\n        color.rgb /= color.a;\n    }\n\n    color.r += diff;\n    color.g += diff;\n    color.b += diff;\n\n    // Premultiply alpha again.\n    color.rgb *= color.a;\n\n    gl_FragColor = color;\n}\n"
      , ua = function(t) {
        function e(e, i) {
            void 0 === e && (e = .5),
            void 0 === i && (i = Math.random()),
            t.call(this, to, ha, {
                uNoise: 0,
                uSeed: 0
            }),
            this.noise = e,
            this.seed = i
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            noise: {
                configurable: !0
            },
            seed: {
                configurable: !0
            }
        };
        return i.noise.get = function() {
            return this.uniforms.uNoise
        }
        ,
        i.noise.set = function(t) {
            this.uniforms.uNoise = t
        }
        ,
        i.seed.get = function() {
            return this.uniforms.uSeed
        }
        ,
        i.seed.set = function(t) {
            this.uniforms.uSeed = t
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Sn)
      , la = new Fi;
    tr.prototype._cacheAsBitmap = !1,
    tr.prototype._cacheData = !1;
    var ca = function() {
        this.textureCacheId = null,
        this.originalRender = null,
        this.originalRenderCanvas = null,
        this.originalCalculateBounds = null,
        this.originalGetLocalBounds = null,
        this.originalUpdateTransform = null,
        this.originalHitTest = null,
        this.originalDestroy = null,
        this.originalMask = null,
        this.originalFilterArea = null,
        this.sprite = null
    };
    Object.defineProperties(tr.prototype, {
        cacheAsBitmap: {
            get: function() {
                return this._cacheAsBitmap
            },
            set: function(t) {
                if (this._cacheAsBitmap !== t) {
                    this._cacheAsBitmap = t;
                    var e;
                    t ? (this._cacheData || (this._cacheData = new ca),
                    e = this._cacheData,
                    e.originalRender = this.render,
                    e.originalRenderCanvas = this.renderCanvas,
                    e.originalUpdateTransform = this.updateTransform,
                    e.originalCalculateBounds = this.calculateBounds,
                    e.originalGetLocalBounds = this.getLocalBounds,
                    e.originalDestroy = this.destroy,
                    e.originalContainsPoint = this.containsPoint,
                    e.originalMask = this._mask,
                    e.originalFilterArea = this.filterArea,
                    this.render = this._renderCached,
                    this.renderCanvas = this._renderCachedCanvas,
                    this.destroy = this._cacheAsBitmapDestroy) : (e = this._cacheData,
                    e.sprite && this._destroyCachedDisplayObject(),
                    this.render = e.originalRender,
                    this.renderCanvas = e.originalRenderCanvas,
                    this.calculateBounds = e.originalCalculateBounds,
                    this.getLocalBounds = e.originalGetLocalBounds,
                    this.destroy = e.originalDestroy,
                    this.updateTransform = e.originalUpdateTransform,
                    this.containsPoint = e.originalContainsPoint,
                    this._mask = e.originalMask,
                    this.filterArea = e.originalFilterArea)
                }
            }
        }
    }),
    tr.prototype._renderCached = function(t) {
        !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObject(t),
        this._cacheData.sprite.transform._worldID = this.transform._worldID,
        this._cacheData.sprite.worldAlpha = this.worldAlpha,
        this._cacheData.sprite._render(t))
    }
    ,
    tr.prototype._initCachedDisplayObject = function(t) {
        if (!this._cacheData || !this._cacheData.sprite) {
            var e = this.alpha;
            this.alpha = 1,
            t.batch.flush();
            var i = this.getLocalBounds().clone();
            if (this.filters) {
                var r = this.filters[0].padding;
                i.pad(r)
            }
            i.ceil(Ie.RESOLUTION);
            var n = t.renderTexture.current
              , o = t.renderTexture.sourceFrame
              , s = t.projection.transform
              , a = Nr.create(i.width, i.height)
              , h = "cacheAsBitmap_" + tt();
            this._cacheData.textureCacheId = h,
            xr.addToCache(a.baseTexture, h),
            Lr.addToCache(a, h);
            var u = la;
            u.tx = -i.x,
            u.ty = -i.y,
            this.transform.worldTransform.identity(),
            this.render = this._cacheData.originalRender,
            t.render(this, a, !0, u, !0),
            t.projection.transform = s,
            t.renderTexture.bind(n, o),
            this.render = this._renderCached,
            this.updateTransform = this.displayObjectUpdateTransform,
            this.calculateBounds = this._calculateCachedBounds,
            this.getLocalBounds = this._getCachedLocalBounds,
            this._mask = null,
            this.filterArea = null;
            var l = new Ko(a);
            l.transform.worldTransform = this.transform.worldTransform,
            l.anchor.x = -i.x / i.width,
            l.anchor.y = -i.y / i.height,
            l.alpha = e,
            l._bounds = this._bounds,
            this._cacheData.sprite = l,
            this.transform._parentID = -1,
            this.parent ? this.updateTransform() : (this.parent = t._tempDisplayObjectParent,
            this.updateTransform(),
            this.parent = null),
            this.containsPoint = l.containsPoint.bind(l)
        }
    }
    ,
    tr.prototype._renderCachedCanvas = function(t) {
        !this.visible || this.worldAlpha <= 0 || !this.renderable || (this._initCachedDisplayObjectCanvas(t),
        this._cacheData.sprite.worldAlpha = this.worldAlpha,
        this._cacheData.sprite._renderCanvas(t))
    }
    ,
    tr.prototype._initCachedDisplayObjectCanvas = function(t) {
        if (!this._cacheData || !this._cacheData.sprite) {
            var e = this.getLocalBounds()
              , i = this.alpha;
            this.alpha = 1;
            var r = t.context;
            e.ceil(Ie.RESOLUTION);
            var n = Nr.create(e.width, e.height)
              , o = "cacheAsBitmap_" + tt();
            this._cacheData.textureCacheId = o,
            xr.addToCache(n.baseTexture, o),
            Lr.addToCache(n, o);
            var s = la;
            this.transform.localTransform.copyTo(s),
            s.invert(),
            s.tx -= e.x,
            s.ty -= e.y,
            this.renderCanvas = this._cacheData.originalRenderCanvas,
            t.render(this, n, !0, s, !1),
            t.context = r,
            this.renderCanvas = this._renderCachedCanvas,
            this.updateTransform = this.displayObjectUpdateTransform,
            this.calculateBounds = this._calculateCachedBounds,
            this.getLocalBounds = this._getCachedLocalBounds,
            this._mask = null,
            this.filterArea = null;
            var a = new Ko(n);
            a.transform.worldTransform = this.transform.worldTransform,
            a.anchor.x = -e.x / e.width,
            a.anchor.y = -e.y / e.height,
            a.alpha = i,
            a._bounds = this._bounds,
            this._cacheData.sprite = a,
            this.transform._parentID = -1,
            this.parent ? this.updateTransform() : (this.parent = t._tempDisplayObjectParent,
            this.updateTransform(),
            this.parent = null),
            this.containsPoint = a.containsPoint.bind(a)
        }
    }
    ,
    tr.prototype._calculateCachedBounds = function() {
        this._bounds.clear(),
        this._cacheData.sprite.transform._worldID = this.transform._worldID,
        this._cacheData.sprite._calculateBounds(),
        this._lastBoundsID = this._boundsID
    }
    ,
    tr.prototype._getCachedLocalBounds = function() {
        return this._cacheData.sprite.getLocalBounds()
    }
    ,
    tr.prototype._destroyCachedDisplayObject = function() {
        this._cacheData.sprite._texture.destroy(!0),
        this._cacheData.sprite = null,
        xr.removeFromCache(this._cacheData.textureCacheId),
        Lr.removeFromCache(this._cacheData.textureCacheId),
        this._cacheData.textureCacheId = null
    }
    ,
    tr.prototype._cacheAsBitmapDestroy = function(t) {
        this.cacheAsBitmap = !1,
        this.destroy(t)
    }
    ,
    tr.prototype.name = null,
    er.prototype.getChildByName = function(t) {
        for (var e = 0; e < this.children.length; e++)
            if (this.children[e].name === t)
                return this.children[e];
        return null
    }
    ,
    tr.prototype.getGlobalPosition = function(t, e) {
        return void 0 === t && (t = new Pi),
        void 0 === e && (e = !1),
        this.parent ? this.parent.toGlobal(this.position, t, e) : (t.x = this.position.x,
        t.y = this.position.y),
        t
    }
    ;
    var da = "5.0.0"
      , pa = function(t, e) {
        this.uvBuffer = t,
        this.uvMatrix = e,
        this.data = null,
        this._bufferUpdateId = -1,
        this._textureUpdateId = -1,
        this._updateID = 0
    };
    pa.prototype.update = function(t) {
        if (t || this._bufferUpdateId !== this.uvBuffer._updateID || this._textureUpdateId !== this.uvMatrix._updateID) {
            this._bufferUpdateId = this.uvBuffer._updateID,
            this._textureUpdateId = this.uvMatrix._updateID;
            var e = this.uvBuffer.data;
            this.data && this.data.length === e.length || (this.data = new Float32Array(e.length)),
            this.uvMatrix.multiplyUvs(e, this.data),
            this._updateID++
        }
    }
    ;
    var fa = new Pi
      , va = new Ji
      , ga = function(t) {
        function e(e, i, r, n) {
            void 0 === n && (n = ni.TRIANGLES),
            t.call(this),
            this.geometry = e,
            e.refCount++,
            this.shader = i,
            this.state = r || wn.for2d(),
            this.drawMode = n,
            this.start = 0,
            this.size = 0,
            this.uvs = null,
            this.indices = null,
            this.vertexData = new Float32Array(1),
            this.vertexDirty = 0,
            this._transformID = -1,
            this.tint = 16777215,
            this.blendMode = ri.NORMAL,
            this._roundPixels = Ie.ROUND_PIXELS,
            this.batchUvs = null
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            uvBuffer: {
                configurable: !0
            },
            verticesBuffer: {
                configurable: !0
            },
            material: {
                configurable: !0
            },
            blendMode: {
                configurable: !0
            },
            roundPixels: {
                configurable: !0
            },
            tint: {
                configurable: !0
            },
            texture: {
                configurable: !0
            }
        };
        return i.uvBuffer.get = function() {
            return this.geometry.buffers[1]
        }
        ,
        i.verticesBuffer.get = function() {
            return this.geometry.buffers[0]
        }
        ,
        i.material.set = function(t) {
            this.shader = t
        }
        ,
        i.material.get = function() {
            return this.shader
        }
        ,
        i.blendMode.set = function(t) {
            this.state.blendMode = t
        }
        ,
        i.blendMode.get = function() {
            return this.state.blendMode
        }
        ,
        i.roundPixels.set = function(t) {
            this._roundPixels !== t && (this._transformID = -1),
            this._roundPixels = t
        }
        ,
        i.roundPixels.get = function() {
            return this._roundPixels
        }
        ,
        i.tint.get = function() {
            return this.shader.tint
        }
        ,
        i.tint.set = function(t) {
            this.shader.tint = t
        }
        ,
        i.texture.get = function() {
            return this.shader.texture
        }
        ,
        i.texture.set = function(t) {
            this.shader.texture = t
        }
        ,
        e.prototype._render = function(t) {
            var i = this.geometry.buffers[0].data;
            this.shader.batchable && this.drawMode === ni.TRIANGLES && i.length < 2 * e.BATCHABLE_SIZE ? this._renderToBatch(t) : this._renderDefault(t)
        }
        ,
        e.prototype._renderDefault = function(t) {
            var e = this.shader;
            e.alpha = this.worldAlpha,
            e.update && e.update(),
            t.batch.flush(),
            e.program.uniformData.translationMatrix && (e.uniforms.translationMatrix = this.transform.worldTransform.toArray(!0)),
            t.shader.bind(e),
            t.state.set(this.state),
            t.geometry.bind(this.geometry, e),
            t.geometry.draw(this.drawMode, this.size, this.start, this.geometry.instanceCount)
        }
        ,
        e.prototype._renderToBatch = function(t) {
            var e = this.geometry;
            this.shader.uvMatrix && (this.shader.uvMatrix.update(),
            this.calculateUvs()),
            this.calculateVertices(),
            this.indices = e.indexBuffer.data,
            this._tintRGB = this.shader._tintRGB,
            this._texture = this.shader.texture;
            var i = this.material.pluginName;
            t.batch.setObjectRenderer(t.plugins[i]),
            t.plugins[i].render(this)
        }
        ,
        e.prototype.calculateVertices = function() {
            var t = this.geometry
              , e = t.buffers[0].data;
            if (t.vertexDirtyId !== this.vertexDirty || this._transformID !== this.transform._worldID) {
                this._transformID = this.transform._worldID,
                this.vertexData.length !== e.length && (this.vertexData = new Float32Array(e.length));
                for (var i = this.transform.worldTransform, r = i.a, n = i.b, o = i.c, s = i.d, a = i.tx, h = i.ty, u = this.vertexData, l = 0; l < u.length / 2; l++) {
                    var c = e[2 * l]
                      , d = e[2 * l + 1];
                    u[2 * l] = r * c + o * d + a,
                    u[2 * l + 1] = n * c + s * d + h
                }
                if (this._roundPixels)
                    for (var p = 0; p < u.length; p++)
                        u[p] = Math.round(u[p]);
                this.vertexDirty = t.vertexDirtyId
            }
        }
        ,
        e.prototype.calculateUvs = function() {
            var t = this.geometry.buffers[1];
            this.shader.uvMatrix.isSimple ? this.uvs = t.data : (this.batchUvs || (this.batchUvs = new pa(t,this.shader.uvMatrix)),
            this.batchUvs.update(),
            this.uvs = this.batchUvs.data)
        }
        ,
        e.prototype._calculateBounds = function() {
            this.calculateVertices(),
            this._bounds.addVertexData(this.vertexData, 0, this.vertexData.length)
        }
        ,
        e.prototype.containsPoint = function(t) {
            if (!this.getBounds().contains(t.x, t.y))
                return !1;
            this.worldTransform.applyInverse(t, fa);
            for (var e = this.geometry.getBuffer("aVertexPosition").data, i = va.points, r = this.geometry.getIndex().data, n = r.length, o = 4 === this.drawMode ? 3 : 1, s = 0; s + 2 < n; s += o) {
                var a = 2 * r[s]
                  , h = 2 * r[s + 1]
                  , u = 2 * r[s + 2];
                if (i[0] = e[a],
                i[1] = e[a + 1],
                i[2] = e[h],
                i[3] = e[h + 1],
                i[4] = e[u],
                i[5] = e[u + 1],
                va.contains(fa.x, fa.y))
                    return !0
            }
            return !1
        }
        ,
        e.prototype.destroy = function(e) {
            t.prototype.destroy.call(this, e),
            this.geometry.refCount--,
            0 === this.geometry.refCount && this.geometry.dispose(),
            this.geometry = null,
            this.shader = null,
            this.state = null,
            this.uvs = null,
            this.indices = null,
            this.vertexData = null
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(er);
    ga.BATCHABLE_SIZE = 100;
    var ma = "attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 translationMatrix;\nuniform mat3 uTextureMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * translationMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n\n    vTextureCoord = (uTextureMatrix * vec3(aTextureCoord, 1.0)).xy;\n}\n"
      , ya = "varying vec2 vTextureCoord;\nuniform vec4 uColor;\n\nuniform sampler2D uSampler;\n\nvoid main(void)\n{\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * uColor;\n}\n"
      , _a = function(t) {
        function e(e, i) {
            var r = {
                uSampler: e,
                alpha: 1,
                uTextureMatrix: Fi.IDENTITY,
                uColor: new Float32Array([1, 1, 1, 1])
            };
            i = Object.assign({
                tint: 16777215,
                alpha: 1,
                pluginName: "batch"
            }, i),
            i.uniforms && Object.assign(r, i.uniforms),
            t.call(this, i.program || _n.from(ma, ya), r),
            this._colorDirty = !1,
            this.uvMatrix = new On(e),
            this.batchable = void 0 === i.program,
            this.pluginName = i.pluginName,
            this.tint = i.tint,
            this.alpha = i.alpha
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            texture: {
                configurable: !0
            },
            alpha: {
                configurable: !0
            },
            tint: {
                configurable: !0
            }
        };
        return i.texture.get = function() {
            return this.uniforms.uSampler
        }
        ,
        i.texture.set = function(t) {
            this.uniforms.uSampler !== t && (this.uniforms.uSampler = t,
            this.uvMatrix.texture = t)
        }
        ,
        i.alpha.set = function(t) {
            t !== this._alpha && (this._alpha = t,
            this._colorDirty = !0)
        }
        ,
        i.alpha.get = function() {
            return this._alpha
        }
        ,
        i.tint.set = function(t) {
            t !== this._tint && (this._tint = t,
            this._tintRGB = (t >> 16) + (65280 & t) + ((255 & t) << 16),
            this._colorDirty = !0)
        }
        ,
        i.tint.get = function() {
            return this._tint
        }
        ,
        e.prototype.update = function() {
            if (this._colorDirty) {
                this._colorDirty = !1;
                var t = this.texture.baseTexture;
                J(this._tint, this._alpha, this.uniforms.uColor, t.premultiplyAlpha)
            }
            this.uvMatrix.update() && (this.uniforms.uTextureMatrix = this.uvMatrix.mapCoord)
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(bn)
      , xa = function(t) {
        function e(e, i, r) {
            t.call(this);
            var n = new Xr(e)
              , o = new Xr(i,!0)
              , s = new Xr(r,!0,!0);
            this.addAttribute("aVertexPosition", n, 2, !1, ai.FLOAT).addAttribute("aTextureCoord", o, 2, !1, ai.FLOAT).addIndex(s),
            this._updateId = -1
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            vertexDirtyId: {
                configurable: !0
            }
        };
        return i.vertexDirtyId.get = function() {
            return this.buffers[0]._updateID
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Vr)
      , ba = function(t) {
        function e(e, i, r, n) {
            void 0 === e && (e = 100),
            void 0 === i && (i = 100),
            void 0 === r && (r = 10),
            void 0 === n && (n = 10),
            t.call(this),
            this.segWidth = r,
            this.segHeight = n,
            this.width = e,
            this.height = i,
            this.build()
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.build = function() {
            for (var t = this.segWidth * this.segHeight, e = [], i = [], r = [], n = this.segWidth - 1, o = this.segHeight - 1, s = this.width / n, a = this.height / o, h = 0; h < t; h++) {
                var u = h % this.segWidth
                  , l = h / this.segWidth | 0;
                e.push(u * s, l * a),
                i.push(u / n, l / o)
            }
            for (var c = n * o, d = 0; d < c; d++) {
                var p = d % n
                  , f = d / n | 0
                  , v = f * this.segWidth + p
                  , g = f * this.segWidth + p + 1
                  , m = (f + 1) * this.segWidth + p
                  , y = (f + 1) * this.segWidth + p + 1;
                r.push(v, g, m, g, y, m)
            }
            this.buffers[0].data = new Float32Array(e),
            this.buffers[1].data = new Float32Array(i),
            this.indexBuffer.data = new Uint16Array(r),
            this.buffers[0].update(),
            this.buffers[1].update(),
            this.indexBuffer.update()
        }
        ,
        e
    }(xa)
      , Ta = function(t) {
        function e(e, i) {
            void 0 === e && (e = 200),
            t.call(this, new Float32Array(4 * i.length), new Float32Array(4 * i.length), new Uint16Array(6 * (i.length - 1))),
            this.points = i,
            this.width = e,
            this.build()
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype.build = function() {
            var t = this.points;
            if (t) {
                var e = this.getBuffer("aVertexPosition")
                  , i = this.getBuffer("aTextureCoord")
                  , r = this.getIndex();
                if (!(t.length < 1)) {
                    e.data.length / 4 !== t.length && (e.data = new Float32Array(4 * t.length),
                    i.data = new Float32Array(4 * t.length),
                    r.data = new Uint16Array(6 * (t.length - 1)));
                    var n = i.data
                      , o = r.data;
                    n[0] = 0,
                    n[1] = 0,
                    n[2] = 0,
                    n[3] = 1;
                    for (var s = t.length, a = 0; a < s; a++) {
                        var h = 4 * a
                          , u = a / (s - 1);
                        n[h] = u,
                        n[h + 1] = 0,
                        n[h + 2] = u,
                        n[h + 3] = 1
                    }
                    for (var l = 0, c = 0; c < s - 1; c++) {
                        var d = 2 * c;
                        o[l++] = d,
                        o[l++] = d + 1,
                        o[l++] = d + 2,
                        o[l++] = d + 2,
                        o[l++] = d + 1,
                        o[l++] = d + 3
                    }
                    i.update(),
                    r.update(),
                    this.updateVertices()
                }
            }
        }
        ,
        e.prototype.updateVertices = function() {
            var t = this.points;
            if (!(t.length < 1)) {
                for (var e, i = t[0], r = 0, n = 0, o = this.buffers[0].data, s = t.length, a = 0; a < s; a++) {
                    var h = t[a]
                      , u = 4 * a;
                    e = a < t.length - 1 ? t[a + 1] : h,
                    n = -(e.x - i.x),
                    r = e.y - i.y;
                    var l = Math.sqrt(r * r + n * n)
                      , c = this.width / 2;
                    r /= l,
                    n /= l,
                    r *= c,
                    n *= c,
                    o[u] = h.x + r,
                    o[u + 1] = h.y + n,
                    o[u + 2] = h.x - r,
                    o[u + 3] = h.y - n,
                    i = h
                }
                this.buffers[0].update()
            }
        }
        ,
        e.prototype.update = function() {
            this.updateVertices()
        }
        ,
        e
    }(xa)
      , wa = function(t) {
        function e(e, i) {
            var r = new Ta(e.height,i)
              , n = new _a(e);
            t.call(this, r, n),
            this.autoUpdate = !0
        }
        return t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e,
        e.prototype._render = function(e) {
            (this.autoUpdate || this.geometry.width !== this.shader.texture.height) && (this.geometry.width = this.shader.texture.height,
            this.geometry.update()),
            t.prototype._render.call(this, e)
        }
        ,
        e
    }(ga)
      , Ea = function(t) {
        function e(e, i, r) {
            var n = new ba(e.width,e.height,i,r)
              , o = new _a(Lr.WHITE);
            t.call(this, n, o),
            this.texture = e
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            texture: {
                configurable: !0
            }
        };
        return e.prototype.textureUpdated = function() {
            this._textureID = this.shader.texture._updateID,
            this.geometry.width = this.shader.texture.width,
            this.geometry.height = this.shader.texture.height,
            this.geometry.build()
        }
        ,
        i.texture.set = function(t) {
            this.shader.texture !== t && (this.shader.texture = t,
            this._textureID = -1,
            t.baseTexture.valid ? this.textureUpdated() : t.once("update", this.textureUpdated, this))
        }
        ,
        i.texture.get = function() {
            return this.shader.texture
        }
        ,
        e.prototype._render = function(e) {
            this._textureID !== this.shader.texture._updateID && this.textureUpdated(),
            t.prototype._render.call(this, e)
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(ga)
      , Sa = function(t) {
        function e(e, i, r, n, o) {
            void 0 === e && (e = Lr.EMPTY);
            var s = new xa(i,r,n);
            s.getBuffer("aVertexPosition").static = !1;
            var a = new _a(e);
            t.call(this, s, a, null, o),
            this.autoUpdate = !0
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            vertices: {
                configurable: !0
            }
        };
        return i.vertices.get = function() {
            return this.geometry.getBuffer("aVertexPosition").data
        }
        ,
        i.vertices.set = function(t) {
            this.geometry.getBuffer("aVertexPosition").data = t
        }
        ,
        e.prototype._render = function(e) {
            this.autoUpdate && this.geometry.getBuffer("aVertexPosition").update(),
            t.prototype._render.call(this, e)
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(ga)
      , Ia = 10
      , Pa = function(t) {
        function e(e, i, r, n, o) {
            t.call(this, Lr.WHITE, 4, 4),
            this._origWidth = e.orig.width,
            this._origHeight = e.orig.height,
            this._width = this._origWidth,
            this._height = this._origHeight,
            this._leftWidth = void 0 !== i ? i : Ia,
            this._rightWidth = void 0 !== n ? n : Ia,
            this._topHeight = void 0 !== r ? r : Ia,
            this._bottomHeight = void 0 !== o ? o : Ia,
            this.texture = e
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            vertices: {
                configurable: !0
            },
            width: {
                configurable: !0
            },
            height: {
                configurable: !0
            },
            leftWidth: {
                configurable: !0
            },
            rightWidth: {
                configurable: !0
            },
            topHeight: {
                configurable: !0
            },
            bottomHeight: {
                configurable: !0
            }
        };
        return e.prototype.textureUpdated = function() {
            this._textureID = this.shader.texture._updateID,
            this._refresh()
        }
        ,
        i.vertices.get = function() {
            return this.geometry.getBuffer("aVertexPosition").data
        }
        ,
        i.vertices.set = function(t) {
            this.geometry.getBuffer("aVertexPosition").data = t
        }
        ,
        e.prototype.updateHorizontalVertices = function() {
            var t = this.vertices
              , e = this._topHeight + this._bottomHeight
              , i = this._height > e ? 1 : this._height / e;
            t[9] = t[11] = t[13] = t[15] = this._topHeight * i,
            t[17] = t[19] = t[21] = t[23] = this._height - this._bottomHeight * i,
            t[25] = t[27] = t[29] = t[31] = this._height
        }
        ,
        e.prototype.updateVerticalVertices = function() {
            var t = this.vertices
              , e = this._leftWidth + this._rightWidth
              , i = this._width > e ? 1 : this._width / e;
            t[2] = t[10] = t[18] = t[26] = this._leftWidth * i,
            t[4] = t[12] = t[20] = t[28] = this._width - this._rightWidth * i,
            t[6] = t[14] = t[22] = t[30] = this._width
        }
        ,
        i.width.get = function() {
            return this._width
        }
        ,
        i.width.set = function(t) {
            this._width = t,
            this._refresh()
        }
        ,
        i.height.get = function() {
            return this._height
        }
        ,
        i.height.set = function(t) {
            this._height = t,
            this._refresh()
        }
        ,
        i.leftWidth.get = function() {
            return this._leftWidth
        }
        ,
        i.leftWidth.set = function(t) {
            this._leftWidth = t,
            this._refresh()
        }
        ,
        i.rightWidth.get = function() {
            return this._rightWidth
        }
        ,
        i.rightWidth.set = function(t) {
            this._rightWidth = t,
            this._refresh()
        }
        ,
        i.topHeight.get = function() {
            return this._topHeight
        }
        ,
        i.topHeight.set = function(t) {
            this._topHeight = t,
            this._refresh()
        }
        ,
        i.bottomHeight.get = function() {
            return this._bottomHeight
        }
        ,
        i.bottomHeight.set = function(t) {
            this._bottomHeight = t,
            this._refresh()
        }
        ,
        e.prototype._refresh = function() {
            var t = this.texture
              , e = this.geometry.buffers[1].data;
            this._origWidth = t.orig.width,
            this._origHeight = t.orig.height;
            var i = 1 / this._origWidth
              , r = 1 / this._origHeight;
            e[0] = e[8] = e[16] = e[24] = 0,
            e[1] = e[3] = e[5] = e[7] = 0,
            e[6] = e[14] = e[22] = e[30] = 1,
            e[25] = e[27] = e[29] = e[31] = 1,
            e[2] = e[10] = e[18] = e[26] = i * this._leftWidth,
            e[4] = e[12] = e[20] = e[28] = 1 - i * this._rightWidth,
            e[9] = e[11] = e[13] = e[15] = r * this._topHeight,
            e[17] = e[19] = e[21] = e[23] = 1 - r * this._bottomHeight,
            this.updateHorizontalVertices(),
            this.updateVerticalVertices(),
            this.geometry.buffers[0].update(),
            this.geometry.buffers[1].update()
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Ea)
      , Aa = function(t) {
        function e(e, i) {
            t.call(this, e[0]instanceof Lr ? e[0] : e[0].texture),
            this._textures = null,
            this._durations = null,
            this.textures = e,
            this._autoUpdate = !1 !== i,
            this.animationSpeed = 1,
            this.loop = !0,
            this.updateAnchor = !1,
            this.onComplete = null,
            this.onFrameChange = null,
            this.onLoop = null,
            this._currentTime = 0,
            this.playing = !1
        }
        t && (e.__proto__ = t),
        e.prototype = Object.create(t && t.prototype),
        e.prototype.constructor = e;
        var i = {
            totalFrames: {
                configurable: !0
            },
            textures: {
                configurable: !0
            },
            currentFrame: {
                configurable: !0
            }
        };
        return e.prototype.stop = function() {
            this.playing && (this.playing = !1,
            this._autoUpdate && ur.shared.remove(this.update, this))
        }
        ,
        e.prototype.play = function() {
            this.playing || (this.playing = !0,
            this._autoUpdate && ur.shared.add(this.update, this, ar.HIGH))
        }
        ,
        e.prototype.gotoAndStop = function(t) {
            this.stop();
            var e = this.currentFrame;
            this._currentTime = t,
            e !== this.currentFrame && this.updateTexture()
        }
        ,
        e.prototype.gotoAndPlay = function(t) {
            var e = this.currentFrame;
            this._currentTime = t,
            e !== this.currentFrame && this.updateTexture(),
            this.play()
        }
        ,
        e.prototype.update = function(t) {
            var e = this.animationSpeed * t
              , i = this.currentFrame;
            if (null !== this._durations) {
                var r = this._currentTime % 1 * this._durations[this.currentFrame];
                for (r += e / 60 * 1e3; r < 0; )
                    this._currentTime--,
                    r += this._durations[this.currentFrame];
                var n = Math.sign(this.animationSpeed * t);
                for (this._currentTime = Math.floor(this._currentTime); r >= this._durations[this.currentFrame]; )
                    r -= this._durations[this.currentFrame] * n,
                    this._currentTime += n;
                this._currentTime += r / this._durations[this.currentFrame]
            } else
                this._currentTime += e;
            this._currentTime < 0 && !this.loop ? (this.gotoAndStop(0),
            this.onComplete && this.onComplete()) : this._currentTime >= this._textures.length && !this.loop ? (this.gotoAndStop(this._textures.length - 1),
            this.onComplete && this.onComplete()) : i !== this.currentFrame && (this.loop && this.onLoop && (this.animationSpeed > 0 && this.currentFrame < i ? this.onLoop() : this.animationSpeed < 0 && this.currentFrame > i && this.onLoop()),
            this.updateTexture())
        }
        ,
        e.prototype.updateTexture = function() {
            this._texture = this._textures[this.currentFrame],
            this._textureID = -1,
            this._textureTrimmedID = -1,
            this._cachedTint = 16777215,
            this.uvs = this._texture._uvs.uvsFloat32,
            this.updateAnchor && this._anchor.copyFrom(this._texture.defaultAnchor),
            this.onFrameChange && this.onFrameChange(this.currentFrame)
        }
        ,
        e.prototype.destroy = function(e) {
            this.stop(),
            t.prototype.destroy.call(this, e),
            this.onComplete = null,
            this.onFrameChange = null,
            this.onLoop = null
        }
        ,
        e.fromFrames = function(t) {
            for (var i = [], r = 0; r < t.length; ++r)
                i.push(Lr.from(t[r]));
            return new e(i)
        }
        ,
        e.fromImages = function(t) {
            for (var i = [], r = 0; r < t.length; ++r)
                i.push(Lr.from(t[r]));
            return new e(i)
        }
        ,
        i.totalFrames.get = function() {
            return this._textures.length
        }
        ,
        i.textures.get = function() {
            return this._textures
        }
        ,
        i.textures.set = function(t) {
            if (t[0]instanceof Lr)
                this._textures = t,
                this._durations = null;
            else {
                this._textures = [],
                this._durations = [];
                for (var e = 0; e < t.length; e++)
                    this._textures.push(t[e].texture),
                    this._durations.push(t[e].time)
            }
            this.gotoAndStop(0),
            this.updateTexture()
        }
        ,
        i.currentFrame.get = function() {
            var t = Math.floor(this._currentTime) % this._textures.length;
            return t < 0 && (t += this._textures.length),
            t
        }
        ,
        Object.defineProperties(e.prototype, i),
        e
    }(Ko);
    Qn.registerPlugin("accessibility", rr),
    Qn.registerPlugin("extract", vo),
    Qn.registerPlugin("interaction", So),
    Qn.registerPlugin("particle", Fs),
    Qn.registerPlugin("prepare", hs),
    Qn.registerPlugin("batch", po),
    Qn.registerPlugin("tilingSprite", zs),
    Ps.registerPlugin(Ys),
    Ps.registerPlugin(Bs),
    cs.registerPlugin(dr),
    cs.registerPlugin(As);
    var Oa = {
        AlphaFilter: qs,
        BlurFilter: $s,
        BlurFilterPass: Qs,
        ColorMatrixFilter: ea,
        DisplacementFilter: na,
        FXAAFilter: aa,
        NoiseFilter: ua
    };
    return t.AbstractBatchRenderer = oo,
    t.AbstractRenderer = Jn,
    t.AnimatedSprite = Aa,
    t.AppLoaderPlugin = As,
    t.Application = cs,
    t.Attribute = Ur,
    t.BLEND_MODES = ri,
    t.BaseRenderTexture = Dr,
    t.BaseTexture = xr,
    t.BatchDrawCall = io,
    t.BatchGeometry = ao,
    t.BatchPluginFactory = lo,
    t.BatchRenderer = po,
    t.BatchShaderGenerator = so,
    t.BitmapFontLoader = Ys,
    t.BitmapText = Vs,
    t.Bounds = $i,
    t.Buffer = Xr,
    t.Circle = Zi,
    t.Container = er,
    t.CubeTexture = eo,
    t.DEG_TO_RAD = Di,
    t.DRAW_MODES = ni,
    t.DisplayObject = tr,
    t.ENV = ei,
    t.Ellipse = Ki,
    t.FORMATS = oi,
    t.FillStyle = Ao,
    t.Filter = Sn,
    t.Framebuffer = Cr,
    t.GC_MODES = ci,
    t.GLProgram = Bn,
    t.GLTexture = xr,
    t.GRAPHICS_CURVES = Po,
    t.Geometry = Vr,
    t.Graphics = Wo,
    t.GraphicsData = Oo,
    t.GraphicsGeometry = ko,
    t.GroupD8 = Hi,
    t.LineStyle = Xo,
    t.Loader = Ps,
    t.LoaderResource = Os,
    t.MIPMAP_MODES = li,
    t.Matrix = Fi,
    t.Mesh = ga,
    t.MeshBatchUvs = pa,
    t.MeshGeometry = xa,
    t.MeshMaterial = _a,
    t.NineSlicePlane = Pa,
    t.ObjectRenderer = Qr,
    t.ObservablePoint = Ai,
    t.PI_2 = Ci,
    t.PRECISION = di,
    t.ParticleContainer = Cs,
    t.ParticleRenderer = Fs,
    t.PlaneGeometry = ba,
    t.Point = Pi,
    t.Polygon = Ji,
    t.Program = _n,
    t.Quad = Yr,
    t.QuadUv = Wr,
    t.RAD_TO_DEG = Mi,
    t.RENDERER_TYPE = ii,
    t.Rectangle = Yi,
    t.RenderTexture = Nr,
    t.RenderTexturePool = Br,
    t.Renderer = Qn,
    t.RopeGeometry = Ta,
    t.RoundedRectangle = Qi,
    t.Runner = or,
    t.SCALE_MODES = hi,
    t.SHAPES = Ri,
    t.Shader = bn,
    t.SimpleMesh = Sa,
    t.SimplePlane = Ea,
    t.SimpleRope = wa,
    t.Sprite = Ko,
    t.SpriteMaskFilter = Mn,
    t.Spritesheet = Ls,
    t.SpritesheetLoader = Bs,
    t.State = wn,
    t.System = Ar,
    t.TARGETS = si,
    t.TEXT_GRADIENT = Jo,
    t.TYPES = ai,
    t.Text = os,
    t.TextMetrics = is,
    t.TextStyle = ts,
    t.Texture = Lr,
    t.TextureLoader = Is,
    t.TextureMatrix = On,
    t.TextureUvs = Rr,
    t.Ticker = ur,
    t.TickerPlugin = dr,
    t.TilingSprite = ks,
    t.TilingSpriteRenderer = zs,
    t.Transform = zi,
    t.UPDATE_PRIORITY = ar,
    t.UniformGroup = Zr,
    t.VERSION = "5.1.5",
    t.ViewableBuffer = ro,
    t.WRAP_MODES = ui,
    t.accessibility = nr,
    t.autoDetectRenderer = Mt,
    t.checkMaxIfStatementsInShader = Pt,
    t.defaultFilterVertex = to,
    t.defaultVertex = $n,
    t.extract = go,
    t.filters = Oa,
    t.interaction = Io,
    t.isMobile = Se,
    t.prepare = ls,
    t.resources = Pr,
    t.settings = Ie,
    t.systems = Zn,
    t.useDeprecated = ce,
    t.utils = Ii,
    t
}({});
PIXI.useDeprecated();
!function(e) {
    for (var n = 0, i = ["ms", "moz", "webkit", "o"], t = 0; t < i.length && !e.requestAnimationFrame; ++t)
        e.requestAnimationFrame = e[i[t] + "RequestAnimationFrame"],
        e.cancelAnimationFrame = e[i[t] + "CancelAnimationFrame"] || e[i[t] + "CancelRequestAnimationFrame"];
    e.requestAnimationFrame || (e.requestAnimationFrame = function(i, t) {
        var a = (new Date).getTime()
          , r = Math.max(0, 16 - (a - n))
          , m = e.setTimeout(function() {
            i(a + r)
        }, r);
        return n = a + r,
        m
    }
    ),
    e.cancelAnimationFrame || (e.cancelAnimationFrame = function(e) {
        clearTimeout(e)
    }
    ),
    Number.isFinite = Number.isFinite || function(e) {
        return "number" == typeof e && isFinite(e)
    }
    ,
    String.prototype.replaceAll = function(e, n) {
        return this.replace(new RegExp(e,"g"), n)
    }
}(window);

} 

var {<a href="https://wormxt.theoxt.com">WormXÐ¢_Versions FREE
BY MANO</a>}

}
