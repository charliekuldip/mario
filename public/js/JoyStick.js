export default class JoyStick {
    constructor() {
        this.gamepad = new Gamepad();
    }
    bindEvents(entity) {
        this.origVelocity = entity.vel.x;
        this.gamepad.on('press', 'button_1', () => {
       //     console.log('button 1 was pressed!');
            entity.jump.start();
        });

        this.gamepad.on('release', 'button_1', () => {
      //      console.log('button 1 was released!');
            entity.jump.cancel();
        });

        this.gamepad.on('press', 'button_2', () => {
    //        console.log('button 2 was pressed!');
            entity.vel.x = entity.vel.x * 1.5;
        });

        this.gamepad.on('release', 'button_2', () => {
            //        console.log('button 2 was pressed!');
            entity.vel.x = this.origVelocity;
        });

        this.gamepad.on('press', 'stick_axis_left', (e) => {
           console.log('stick_axis_left was pressed!', e);
           console.log(e.value[0]);
            entity.go.dir = parseInt(e.value[0]);
        });
        this.gamepad.on('release', 'stick_axis_left', (e) => {
            console.log(e.value[0]);
            entity.go.dir = 0;
        });

        this.gamepad.on('press', 'stick_button_left', (e) => {
            console.log('stick_button_left was pressed!');
        })
        
    }
}
  