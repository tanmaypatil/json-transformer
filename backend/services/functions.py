from typing import Any

FUNCTIONS: dict[str, callable] = {
    "UPPERCASE": lambda v: v.upper() if isinstance(v, str) else v,
    "TRIM": lambda v: v.strip() if isinstance(v, str) else v,
}

AVAILABLE_FUNCTIONS = list(FUNCTIONS.keys())


def apply_functions(value: Any, function_names: list[str]) -> Any:
    for name in function_names:
        fn = FUNCTIONS.get(name)
        if fn:
            value = fn(value)
    return value
