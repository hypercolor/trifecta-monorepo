export class PasswordUtil {
    public static stripPasswordsFromObject(object: any) {
        Object.keys(object).forEach(key => {
            if (object[key] && object[key].constructor === Object) {
                object[key] = PasswordUtil.stripPasswordsFromObject(object[key]);
            } else if (key.toLowerCase().indexOf('password') !== -1) {
                object[key] = '********';
            }
        });
        return object;
    }
}
