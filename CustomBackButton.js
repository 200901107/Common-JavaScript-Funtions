
/**
 * Implements custom backbutton logic using local storage. 
 * The backbutton default logic may not work properly accross
 * different platforms. This can be used in such scenarios.
 * So we just have button that looks like
 * back button and event handlers that implement our own backbutton
 * logic. The backbutton should have id 'backButton' to use this.
 * Calling init() on page load enables the class.
 * 
 * It does not store more than a fixed size of history(50 pages when
 * this was written)
 *
 */
var backButtonLogic = {
        /**
         * To be called on page load/document.ready to enable this class.
         */
        init:function() {
            // Attach event handler
            this.attacheEventHandler();
            
            // Update the history with current page URL
            this.updateHistory();
        },
        attacheEventHandler:function() {
            if(this.isHistoryPresent()) { // only add if history present
				$("#backButton").swipe( { // id of your back button
				tap:function(e, target) {
					this.backButtonHandler
				}});
                
            }
        },
        /**
         * touchend handler for backbutton.
         */
        backButtonHandler:function(e) {
            // prevent any default logic
            e.preventDefault();
            
            // Get the page browsing history from local storage which is basically an array
            // of URLs in the order of browsing.
            var pageStack = JSON.parse(localStorage.getItem('pageHistoryStack'));
            
            if(!pageStack) { // unexpected. The button to be displayed only when there is history.
                return;
            }
            
            // First one must be the current page URL. Just pop it and set it back into localstorage.
            pageStack.pop();
            localStorage.setItem('pageHistoryStack', JSON.stringify(pageStack));

            // Navigate to the page on top of the stack. Mark it to be coming from back button
            location.replace(pageStack[pageStack.length - 1] + "?back=true");
        },
        isHistoryPresent:function() {
            var pageStack = JSON.parse(localStorage.getItem('pageHistoryStack'));
            if(pageStack) {
                return true; 
            } else {
                return false;
            }
        },
        /**
         * Updates the history of URL loading to help
         * the backbutton logic
         */
        updateHistory:function() {
            
            // Get the current URLs last part(relative URL).
            var href = window.location.href;
            var url = href.substr(href.lastIndexOf('/') + 1);
            
            // Clear the history on apps first screen.
            if(url == 'index.html') {
                localStorage.removeItem('pageHistoryStack');
            }
            
            // Get the page history stack from storage
            var pageHistoryStack = localStorage.getItem('pageHistoryStack');
            var pageStack;
            
            // If page history is not initialized, initialize it
            if(pageHistoryStack == null) {
                pageStack = [];
                localStorage.setItem('pageHistoryStack', JSON.stringify(pageStack));
            } else { // If already present, just get it
                pageStack = JSON.parse(localStorage.getItem('pageHistoryStack'));
            }

            // Check if we are on this page due to a back button click. If so,
            // Don't add this page to history. Else add it.
            var back = getUrlValue("back");
            if(!back) {
                pageStack.push(url);
                // if history is bigger than 50, lose the last
                if(pageStack.length > 50) {
                    pageStack.shift();
                }
                
                localStorage.setItem('pageHistoryStack', JSON.stringify(pageStack));
            }
        }

}