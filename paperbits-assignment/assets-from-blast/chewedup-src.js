(() => {
   var e = document.getElementById("answer");
   e.addEventListener("keyup", (function (e) {
      "Enter" === e.key && (e.preventDefault(), document.getElementById("submitAnswer").click())
   }));
   window.submitAnswer = function () {
      var t;
      /*@preserve
       *  Hints:
       *  - Notice that 26 = C
       *  - The english alphabet has 26 letters
       */
      (
         t = e.value,
         crypto.subtle.digest(
            "SHA-256",
            new TextEncoder("utf-8")
               // Remove spaces, convert to lowercase, and trim
               .encode(t.replace(" ", "")
               .toLowerCase()
               .trim()))
               .then((function (e) {
                  return Array.prototype.map.call(new Uint8Array(e), (function (e) {
                     return ("00" + e.toString(16)).slice(-2)
                  }
               )
            )
            .join("")
         }))
      ).then((function (e) {
         window.location.href = "/".concat(e, ".html")
      }))
   }
})();