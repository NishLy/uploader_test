import { writeFileSync } from "fs";

/**
 * It sets the globalConfig variable to the config parameter if it's not null, otherwise it sets it to
 * the current value of globalConfig
 * @param {UPLOADER_CONFIGURATION | null} [config=null] - UPLOADER_CONFIGURATION | null = null
 * @returns The globalConfig is being returned.
 */
let globalConfig: GLOBAL_CONFIG | null = {
    lab: "LAB2",
    last_config_dir: "",
    last_open: Date.now(),
    list_allowed_ip: ["127.0.0.1"],
    ipvalidation: true,
    logToConsole: true,
  };

export interface GLOBAL_CONFIG {
    logToConsole?: boolean;
    last_config_dir: string;
    lab: string;
    last_open: number;
    ipvalidation?: boolean;
    list_allowed_ip: string[];
}

export function useGlobalConfig(config: GLOBAL_CONFIG | null = null) {
    if (config) {
        globalConfig = config;
        writeFileSync("./config.json", JSON.stringify(config));
    }
    return globalConfig;
}
