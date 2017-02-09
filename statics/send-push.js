$(function() {
  $('.webpush-button').on('click', (e) => {
    navigator.serviceWorker.ready
    .then((serviceWorkerRegistration) => {
      console.log("ready");

      serviceWorkerRegistration.pushManager.getSubscription()
      .then((subscription) => {
        console.log(subscription);
        $.ajax({
          url:'/push',
          type:"POST",
          data: JSON.stringify({
            subscription: subscription,
            message: 'You clicked a button!'
          }),
          contentType:"application/json",
          dataType:"json"
        });

      });
    });
  });
});
