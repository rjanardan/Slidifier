var editor = (function() {

	function setCaretPosition(textarea, pos){
		if(textarea.setSelectionRange) {
			textarea.focus();
			textarea.setSelectionRange(pos,pos);
		} else if (textarea.createTextRange) {
			var range = textarea.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	}
	
	function getLineAtPosition(allText, positionOnLine) {
		var startPosition = positionOnLine;
		var endPosition = positionOnLine;

		while (startPosition > 0 && allText[startPosition-1] !== '\n') {
			startPosition--;
		}

		while (endPosition <= allText.length-1 && allText[endPosition] !== '\n') {
			endPosition++;
		}

		return {start: startPosition, end: endPosition};
	}
	
	return {
		getLineAtPosition: getLineAtPosition,
		setCaretPosition: setCaretPosition
	};
})();


$(document).ready(function() {
	function insertSymbolAtCurrentLine(symbol, atStartOrEnd) {
		var currentPosition = $("#slidesSrc").getSelection().start;
		var allText = $("#slidesSrc").attr("value");
		var line = editor.getLineAtPosition(allText, currentPosition);
		if (atStartOrEnd === "start" && allText[line["start"]] !== symbol){
			symbol += ' ';
		}
		var newText = allText.substr(0, line[atStartOrEnd]) + symbol + allText.substr(line[atStartOrEnd], allText.length);

		$("#slidesSrc").attr("value", newText);

		if (atStartOrEnd === "end") {
			currentPosition = line.end;
		}

		editor.setCaretPosition(document.getElementById("slidesSrc"), currentPosition+symbol.length);
	}

	function isCurrentLineOnlyWhitespace() {
		var currentPosition = $("#slidesSrc").getSelection().start;
		var allText = $("#slidesSrc").attr("value");
		var line = editor.getLineAtPosition(allText, currentPosition);
		var lineString = allText.substr(line.start, line.end);
		return !(/\S/.test(lineString));
	}

	$("#headingbutton").click(function(event) {
		event.preventDefault();
		insertSymbolAtCurrentLine("#", "start");
	});

	$("#listbutton").click(function(event) {
		event.preventDefault();
		insertSymbolAtCurrentLine("-", "start");
	});

	$("#newslidebutton").click(function(event) {
		event.preventDefault();
		var newSlideToken = "---\n\n";
		if (!isCurrentLineOnlyWhitespace()) {
			newSlideToken = "\n\n" + newSlideToken;
		}
		insertSymbolAtCurrentLine(newSlideToken, "end");
	});

	$("#picturedialogbutton").click(function(event) {
		event.preventDefault();
		if ($("#picturesrcForm").is(":visible")) {
			$("#cancelpicturelink").click();
		} else {
			$("#picturesrcForm").slideDown();
		}
	});

	$("#insertpicturebutton").click(function(event) {
		event.preventDefault();
		var imageSrc = $("#picturesrc").attr("value");
		var imageToken = '<img src="'+imageSrc+'"/>\n\n';
		if (!isCurrentLineOnlyWhitespace()) {
			imageToken = "\n\n" + imageToken;
		}
		insertSymbolAtCurrentLine(imageToken, "end");
		$("#picturesrcForm").slideUp();
		$("#picturesrc").attr("value", "http://");
	});

	$("#cancelpicturelink").click(function(event) {
		event.preventDefault();
		$("#picturesrcForm").slideUp();
	});
});