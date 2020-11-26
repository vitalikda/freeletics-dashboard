function fileUpload(formData) {
  const file = formData.getAll();
  const promises = file.map(x =>
    getFileData(x).then(data => {
      return console.log(data);
    })
  );
  return Promise.all(promises);
}

function getFileData(file) {
  return new Promise((resolve, reject) => {
    const fReader = new FileReader();
    // const fileData = document.createElement("img");

    fReader.onload = () => {
      file = fReader.result;
      // resolve(getBase64Image(img));
    };

    fReader.readAsDataURL(file);
  });
}

export { fileUpload };
