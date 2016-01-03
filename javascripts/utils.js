// 'addLoadEvent' enables to add another load function when 'window.onload'
// is called. However, this function is only defined when this script is
// inlined. It is better to check whether this function exists or not before
// calling it:
//
//    if(addLoadEvent) addLoadEvent(new_function);
//
addLoadEvent = function(func) {
  var oldonload = window.onload;
  if (typeof window.onload != 'function') {
    window.onload = func;
  } else {
    window.onload = function() {
      if (oldonload) {
        oldonload();
      }
      func();
    }
  }
}