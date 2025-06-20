  const form_openBtn = document.getElementById("form_openPopupBtn");
  const form_overlay = document.getElementById("form_popupOverlay");
  const form_resultOverlay = document.getElementById("form_resultPopupOverlay");

  function form_changeGender(event){
    const boyLabel = t("formGenderBoy");
    const girlLabel = t("formGenderGirl");

    const isBoy = event.value == 1;
    let successField = document.getElementById("form_success");
    let inner = successField.value;
    let holder = successField.getAttribute("placeholder");

    inner = inner.replace(isBoy ? girlLabel : boyLabel, isBoy ? boyLabel : girlLabel);
    holder = holder.replace(isBoy ? girlLabel : boyLabel, isBoy ? boyLabel : girlLabel);
    inner = inner.replace(isBoy ? girlLabel.toLowerCase() : boyLabel.toLowerCase(), isBoy ? boyLabel.toLowerCase() : girlLabel.toLowerCase());
    holder = holder.replace(isBoy ? girlLabel.toLowerCase() : boyLabel.toLowerCase(), isBoy ? boyLabel.toLowerCase() : girlLabel.toLowerCase());

    successField.value = inner;
    successField.setAttribute("placeholder", holder);
  }

  form_openBtn.addEventListener("click", () => {
    form_overlay.style.display = "flex";
  });

  function form_closePopup() {
    form_overlay.style.display = "none";
  }

  function form_closeResult() {
    form_resultOverlay.style.display = "none";
  }

  document.querySelectorAll('.form_emojiInput').forEach(input => {
    input.addEventListener('input', () => {
      const chars = [...input.value];
      if (chars.length > 1) input.value = chars[0];
    });
  });

  document.getElementById("form_popupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const toEncode = form_getValueOrPlaceHolder("form_gender") + ";" + 
                     form_getValueOrPlaceHolder("form_emoji1") + ";" + 
                     form_getValueOrPlaceHolder("form_emoji2") + ";" +  
                     form_getValueOrPlaceHolder("form_title") + ";" +
                     form_getValueOrPlaceHolder("form_success") + ";" + 
                     form_getValueOrPlaceHolder("form_fail");
    form_closePopup();

    let finalValue = document.location.href.replace(/\?q?.*$/, "") + "?q=" + encodeBase64(toEncode);

    document.getElementById("form_formDataDisplay").value = finalValue;
    form_resultOverlay.style.display = "flex";
  });

  function form_getValueOrPlaceHolder(elementId){
    const element = document.getElementById(elementId);
    const value = element.value;
    if(value == "" || value == null || value == undefined) {
      return element.getAttribute("placeholder");
    }
    return value;
  }

  document.getElementById("form_copyBtn").addEventListener("click", function() {
    const copyLabel = t("formShareCopy");
    const copiedLabel = t("formShareCopied");
    const textarea = document.getElementById("form_formDataDisplay");
    textarea.select();
    textarea.setSelectionRange(0, 99999);
    document.execCommand("copy");
    this.classList.add("form_copied");
    this.innerText = copiedLabel;
    setTimeout(() => {
      this.classList.remove("form_copied");
      this.innerText = copyLabel;
    }, 1500);
  });

function encodeBase64(str) {
  var uriEncoded = encodeURIComponent(str);
  return btoa(uriEncoded);
}