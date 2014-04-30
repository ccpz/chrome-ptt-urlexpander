function ValidURL(str) {
  var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/;

  if(!urlPattern.test(str)) {
    return false;
  } else {
    return true;
  }
}

function parse(domLink) {
	var url = domLink.getAttribute("href");
	if(url && url.indexOf("ppt.cc")!=-1) {
		var key = url.substr(url.length-4, url.length);
		var xhr = new XMLHttpRequest();
			xhr.open("GET", "http://ppt.cc/decode.php?c="+key, true);
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4) {
					var resp = xhr.responseText.split(/\s/);
					if(resp.length>=2 && ValidURL(resp[1]) && resp[1].indexOf("staticflickr")!=-1) { //static image from flickr
						insertImage(domLink, resp[1]);
					} else if(resp.length>=2 && ValidURL(resp[1])) { //short url from ppt.cc
						insertIFrame(domLink, resp[1]);
					} else if(resp.length>=2 && resp[1].indexOf("!data/")==0) { //image from ptt.cc
						insertImage(domLink, url);
					}
				}
			};
		xhr.send();
	}else if(url && url.indexOf("goo.gl")!=-1) {
		var xhr = new XMLHttpRequest();
			xhr.open("GET", "https://www.googleapis.com/urlshortener/v1/url?shortUrl="+url, true);
			xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) {
					var resp = JSON.parse(xhr.responseText);
					if(resp.longUrl) {
						insertIFrame(domLink, resp.longUrl);
					}
				}
			};
		xhr.send();
	
	} else if(url.indexOf("imgur")==-1 && url.indexOf("ptt.cc")==-1){ //imgur is already parsed in ptt
		insertIFrame(domLink, url);
	}
}

function insertIFrame(domLink, url) {
	if(url.indexOf("flickr.com")!=-1 && url.indexOf("lightbox")!=-1)
		url = url.replace(/lightbox\/?/,"");
	if(url.indexOf("flickr.com")!=-1)
		url = url+"/player";
	domLink.innerHTML = domLink.innerHTML + "<br><iframe src=\""+url+"\" width=700 height=700></iframe>";
		
}

function insertImage(domLink, url) {
	if(url.indexOf("http://ppt.cc/")!=-1)
		url = url+"@.jpg";
	domLink.innerHTML = domLink.innerHTML + "<br><img src=\""+url+"\">";
}

if (document.title.indexOf("- 批踢踢實業坊") != -1) {
	var links = document.getElementsByTagName("A");
	for(var i=5;i<links.length;i++){ 
		parse(links[i]);
	}
}