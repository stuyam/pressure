
// Pressure.supported({
//   success:function(){
    Pressure.change('.element', function(force, event){
      // console.log('me!');
      this.style.width = Math.max((200 * force), 200) + 'px';
      this.innerHTML = force;
    });
//     console.log('User and Browser both support force touch');
//   },
//   fail: function(error){
//     console.log(error);
//   }
// });
