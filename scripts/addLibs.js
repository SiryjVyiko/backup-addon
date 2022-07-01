import org.apache.commons.lang3.text.StrSubstitutor;
import com.hivext.api.core.utils.Transport;

var config = {};

function replaceText(text, values) {
    return new StrSubstitutor(values, "${", "}").replace(text);
};

function createScript(scriptName) {
    var url = "${baseUrl}/scripts/" + scriptName;

    try {
        scriptBody = new Transport().get(url);

        scriptBody = replaceText(scriptBody, config);

        jelastic.dev.scripting.DeleteScript(appid, session, scriptName);

        resp = jelastic.dev.scripting.CreateScript(appid, session, scriptName, "js", scriptBody);

        java.lang.Thread.sleep(1000);

        jelastic.dev.scripting.Build(appid, session, scriptName);
    } catch (ex) {
        resp = {
            error: toJSON(ex)
        };
    }

    return resp;
};

resp = createScript("backupAddonLibs/cronToQuartz");
if (resp.result != 0) return resp;

return {
    result: 0
}
