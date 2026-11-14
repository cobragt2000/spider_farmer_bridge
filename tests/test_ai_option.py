"""Adaptive climate opt-in option (v3.20.1): the AI checkbox lives in the options
flow directly under device control, and only there."""

from custom_components.sf.config_flow import _base_schema
from custom_components.sf.const import CONF_AI_LEARN, CONF_ALLOW_CONTROL


def _keys(schema):
    return [getattr(k, "schema", k) for k in schema.schema]


def test_ai_field_is_options_only_and_under_device_control():
    # Initial setup / base: no AI field.
    assert CONF_AI_LEARN not in _keys(_base_schema({}))
    # Options flow: AI field present, immediately after device control.
    keys = _keys(_base_schema({}, include_ai=True))
    assert CONF_AI_LEARN in keys
    assert CONF_ALLOW_CONTROL in keys
    assert keys.index(CONF_AI_LEARN) == keys.index(CONF_ALLOW_CONTROL) + 1


def test_ai_default_off():
    keys = _base_schema({}, include_ai=True).schema
    marker = next(k for k in keys if getattr(k, "schema", None) == CONF_AI_LEARN)
    assert marker.default() is False
