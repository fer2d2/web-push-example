self.addEventListener("push", (event) => {
  let title = (event.data && event.data.text()) || "Yay a message";
  let body = "We have received a push message";
  let tag = "push-simple-demo-notification-tag";
  let icon = '/iyc-icon.png';

  event.waitUntil(
    self.registration.showNotification(title, { body, icon, tag })
  )
});
