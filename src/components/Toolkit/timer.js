// import { router } from '@/main';
export default {
  /*
   * time: the unit of interval
   */
  async sleep (time) {
    const resolve = await new Promise((resolve) => setTimeout(resolve, time))
    return resolve
  }

  // /*
  // * duration: total seconds that needs to be count down from
  // * counterId: html <div > id to display seconds number
  // * url: is the server url postfix that redirect to
  // */
  // async countDown(duration, counterId, url) {
  //   for (let counter = duration; counter >= 0; counter--) {
  //     document.getElementById(counterId).innerHTML = counter;
  //     if (counter === 0) {
  //       router.push('/' + url);
  //     } else {
  //       if (counter === 1) {
  //         document.getElementById('second').innerHTML = 'second';
  //       }
  //       await this.sleep(1000);
  //     }
  //   }
  // }
}
