
import {config, archivist} from "./archivist.conf.ts";

config.outputURL = "http://127.0.0.1:8888";

archivist.run(config);
