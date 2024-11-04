const { fileChooser } = await Promise.all([
  page.waiForEvent("fileChooser"),
  page.click("buton#Upload"),
]);

await fileChooser.setFiles("/");
