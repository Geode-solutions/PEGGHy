declare module "kill-port" {
  function kill(port: number, method?: "tcp" | "udp"): Promise<unknown>;
  export default kill;
}
