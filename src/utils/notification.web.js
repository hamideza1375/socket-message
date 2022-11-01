let notification
export const create = (title = '', body = '', icon = '', click) => {
  // if (!("Notification" in window)) { alert(title); }
  // else if (Notification.permission === "denied") { alert(title); }
  // else if (Notification.permission === "granted") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        notification = new Notification(title, { body, icon });
        click && notification.addEventListener('click', click)
      }
    });
  }
// }

export const close = () => { notification && notification.close() }
