/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

declare module "jsr:@supabase/supabase-js@2" {
    export * from "@supabase/supabase-js";
}

declare module "jsr:@supabase/functions-js/edge-runtime.d.ts" {
    // This is just for the import to work, no actual types needed
} 