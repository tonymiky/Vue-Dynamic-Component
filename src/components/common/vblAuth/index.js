import vblAuth from './vblAuth';
import vblAuthWrap from './vblAuthWrap';

var plugin = {
    install(Vue) {
        if (this.installed) {
            return;
        }
        
        this.installed = true;
        
        Vue.component('vblAuth', vblAuth);
        Vue.component('vblAuthWrap', vblAuthWrap);
    }
};

export default plugin;
