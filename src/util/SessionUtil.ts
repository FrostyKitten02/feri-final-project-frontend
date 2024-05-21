import { Cookies } from 'react-cookie';

export default class SessionUtil {
    private static cookies = new Cookies();

    static setSidebarSelect(status: string) {
        this.cookies.set('sidebar_select', status, { path: '/' });
    }
    static getSidebarSelect(): string | undefined {
        return this.cookies.get('sidebar_select');
    }
     static setSidebarStatus(status: boolean) {
        this.cookies.set('sidebar_status', status, { path: '/' });
    }
    static getSidebarStatus(): boolean | undefined {
        return this.cookies.get('sidebar_status');
    }

}
