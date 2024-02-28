

float fractal(vec2 p, float t)
{
    p = abs(5. - mod(p * .2, 10.)) - 5.;
    float ot = 1000.;
    for (int i = 0; i < 7; i++)
    {
        p = abs(p) / clamp(p.x * p.y, .39, 2.) - 1.;
        if (i > 3)
            ot = min(ot, abs(p.x) + .2 * fract(abs(p.y) * .05 + t * 0.1 + float(i) * .3));
    }
    ot = exp(-10. * ot);
    return ot;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = fragCoord/iResolution.xy;
    uv = (fragCoord - iResolution.xy * 0.5) / iResolution.y;

    // Output to screen
    float t = iTime;
    vec3 p = vec3(uv.xy,1.0);

    float f = fractal(p.xy, t) + fractal(p.xz, t) + fractal(p.yz, t);

    // coloring
    vec3 col = vec3(f, f * f*f , f * f);
    col += col / max(abs(sin(t*0.5)), 0.1) / 3.0;


    fragColor = vec4(col,1.0);


}

