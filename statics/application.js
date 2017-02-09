// Let's check if the browser supports notifications
if (!("Notification" in window)) {
  console.error("This browser does not support desktop notification");
}

// Let's check whether notification permissions have already been granted
else if (Notification.permission === "granted") {
  console.log("Permission to receive notifications has been granted");
}

// Otherwise, we need to ask the user for permission
else if (Notification.permission !== 'denied') {
  notification.requestPermission(function (permission) {
  // If the user accepts, let's create a notification
    if (permission === "granted") {
      console.log("Permission to receive notifications has been granted");
    }
  });
}

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/serviceworker.js')
  .then(function(registration) {
    console.info('Service worker registered');
  });
}
else {
  console.error('Service worker is not supported in this browser');
}

navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
  console.info("User subscribed to web PUSH notifications");
  serviceWorkerRegistration.pushManager
  .subscribe({
    userVisibleOnly: true,
    applicationServerKey: Window.vapidPublicKey
  });

  serviceWorkerRegistration.pushManager.getSubscription()
  .then((subscription) => {
    console.info(subscription);

    $.ajax({
      url:'/subscribe',
      type:"POST",
      data: JSON.stringify(subscription),
      contentType:"application/json",
      dataType:"json"
    });
  });
});
