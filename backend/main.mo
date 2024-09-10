import Text "mo:base/Text";
import Error "mo:base/Error";

actor GEMS {
    public func generateDesign(prompt : Text) : async Text {
        // Simplified function that doesn't use HTTP calls
        return "Generated design based on prompt: " # prompt;
    };
}
