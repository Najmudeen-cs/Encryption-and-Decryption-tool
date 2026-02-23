function caesarCipher(text, shift) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    let char = text[i];
    let code = text.charCodeAt(i);

    if (char >= 'A' && char <= 'Z') {
      result += String.fromCharCode(((code - 65 + shift + 26) % 26) + 65);
    } else if (char >= 'a' && char <= 'z') {
      result += String.fromCharCode(((code - 97 + shift + 26) % 26) + 97);
    } else if (char >= '0' && char <= '9') {
      result += String.fromCharCode(((code - 48 + shift + 10) % 10) + 48);
    } else {
      result += char;
    }
  }
  return result;
}

async function xorImage(key, file, outputName) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8View = new Uint8Array(arrayBuffer);
  for (let i = 0; i < uint8View.length; i++) {
    uint8View[i] ^= key;
  }
  const blob = new Blob([uint8View], { type: file.type });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = outputName;
  link.click();
}

document.addEventListener("DOMContentLoaded", () => {
  const msg = document.getElementById("message");
  const shift = document.getElementById("textShift");
  const showKey = document.getElementById("showKey");
  const textOut = document.getElementById("textOutput");

  document.getElementById("encryptTextBtn").onclick = () => {
    const s = parseInt(shift.value) % 26;
    textOut.textContent = caesarCipher(msg.value, s);
  };

  document.getElementById("decryptTextBtn").onclick = () => {
    const s = parseInt(shift.value) % 26;
    textOut.textContent = caesarCipher(msg.value, -s);
  };

  document.getElementById("copyTextBtn").onclick = () => {
    navigator.clipboard.writeText(textOut.textContent);
    alert("Copied!");
  };

  document.getElementById("saveLogBtn").onclick = () => {
    const blob = new Blob([textOut.textContent], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "encrypted_text_log.txt";
    a.click();
  };

  showKey.addEventListener("change", () => {
    shift.type = showKey.checked ? "text" : "number";
  });

  const imageInput = document.getElementById("imageInput");
  const imageKey = document.getElementById("imageKey");
  const preview = document.getElementById("imagePreview");

  imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (file) {
      preview.style.display = "block";
      preview.src = URL.createObjectURL(file);
    } else {
      preview.style.display = "none";
    }
  });

  document.getElementById("encryptImageBtn").onclick = () => {
    const file = imageInput.files[0];
    const key = parseInt(imageKey.value);
    if (file && key >= 1 && key <= 255) {
      xorImage(key, file, "encrypted_" + file.name);
    } else {
      alert("Select image and valid key (1–255)");
    }
  };

  document.getElementById("decryptImageBtn").onclick = () => {
    const file = imageInput.files[0];
    const key = parseInt(imageKey.value);
    if (file && key >= 1 && key <= 255) {
      xorImage(key, file, "decrypted_" + file.name);
    } else {
      alert("Select image and valid key (1–255)");
    }
  };
});
